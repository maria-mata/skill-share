// const decodedToken = parseJWT(localStorage.getItem('token'))
var userId = 2 // The user ID of the person logged in
const baseURL = 'https://young-peak-51032.herokuapp.com/'
// const baseURL = 'http://localhost:8080/'

$(document).ready(function() {
	$('.button-collapse').sideNav()
	$('.modal').modal()
	$('.logOut').click(logOut)

	$.get(`${baseURL}users/${userId}`)
		.then(showUserProfile)

	$.get(`${baseURL}users/skills/${userId}`)
		.then(showSkillsHave)

	$.get(`${baseURL}skills`)
		.then(showAllSkills)

	$.get(`${baseURL}users/${userId}`)
		.then(showSkillWant)

	$.get(`${baseURL}users/matches/${userId}`)
		.then(appendSkillMatches)

	$('#user-put').submit(updateProfile)
	$('#skills-put').submit(updateSkills) // **

});

function showUserProfile(data) { // THIS WORKS
	// missing photo display
	$('.card-title').text(data[0].name)
	$('#name').val(data[0].name)
	$('#email').val(data[0].email)
	$('#phone').val(data[0].phone)
	$('#bio').val(data[0].bio)
	$('.card-image img').attr({src: `${data[0].photo}`})
	Materialize.updateTextFields()
};

function showSkillsHave(data) { // THIS WORKS
	for (let i = 0; i < data.length; i++) {
		let skill = `<p>
		<input class="skill" type="checkbox" checked="checked" id="${data[i].id}-have"/>
		<label for="${data[i].id}-have">${data[i].name}</label>
		</p>`
		$('#skills-have').append(skill)
	}
};

function showAllSkills(data) { // THIS WORKS
	for (let i = 0; i < data.length; i++) {
		let skillChange = `<p>
      <input name="group1" type="radio" id="${data[i].name}" value=${data[i].id}>
      <label for="${data[i].name}">${data[i].name}</label>
    </p>`
		let skillAdd = `<p>
		<input class="add" type="checkbox" id="${data[i].id}-add" value=${data[i].id}>
		<label for="${data[i].id}-add">${data[i].name}</label>
		</p>`
		$('#change-learn').append(skillChange)
		$('#add-skills').append(skillAdd)
	}
};

function updateProfile(event) { // THIS WORKS
	event.preventDefault()
	updateImage()
	$.ajax({
		url: `${baseURL}users/${userId}`,
		type: 'PUT',
		data: {
			// missing photo part
			name: $('#name').val(),
			email: $('#email').val(),
			phone: $('#phone').val(),
			bio: $('#bio').val()
		},
		success: function(result) {
			showUserProfile(result)
		}
	})
};

function updateSkills(event) {
	event.preventDefault()
	updateSkillLearn()
	updateSkillsHave()
};

function updateSkillLearn() { // THIS WORKS
	let id = $("input[type='radio']:checked").val()
	let skill = `<p class="want">${$("input[type='radio']:checked").attr('id')}</p>`
	if ($(skill).text() != 'undefined') {
		$.ajax({
			url: `${baseURL}users/${userId}`,
			type: 'PUT',
			data: {
				skill_learn: id
			},
			success: function() {
				$('p.want').remove()
				$('#skills-want').append(skill)
				$.get(`${baseURL}users/matches/${userId}`)
					.then(appendSkillMatches)
			}
		})
	}
}

function updateSkillsHave() { // THIS WORKS
	let skillsArray = $('input.add[type="checkbox"]:checked')
	$.ajax({
		url: `${baseURL}users/skills/${userId}`,
		type: 'POST',
		contentType:	"application/json",
		data: JSON.stringify({
			skills_id: pullIds(skillsArray)
		})
	})
};

function pullIds(array) { // THIS WORKS
	let output = []
	for (var i = 0; i < array.length; i++) {
		output.push(Number($(array[i]).val()))
	}
	return output
};

function showSkillWant(data) { // THIS WORKS
	let skill = `<p class="want">${data[0].skills_name}</p>`
	$('#skills-want').append(skill)
};

function appendSkillMatches(data) { // THIS WORKS
	$('#matches li.collection-item').remove()
	for (let i = 0; i < data.length; i++) {
		let match = `<li class="collection-item avatar">
                  <img src="${data[i].photo}"
                  alt="${data[i].name}" class="circle">
                  <span class="title"><b>${data[i].name}</b></span>
                  <p>Can Teach You: ${listOfSkills(data[i].skills)}<br>
                     Wants to Learn: ${data[i].skills_name}
                     <a id="${data[i].id}" href="#match-modal"
                     class="secondary-content modal-trigger">
                     <i class="material-icons">remove_red_eye</i></a>
                  </p>
                </li>`
		$('#matches').append(match)
		$(`#${data[i].id}`).click(() => {
			showMatchProfile(data[i])
		})
	}
};

function showMatchProfile(match) { // THIS WORKS
	$('#match-modal > div.modal-content').empty()
	let content = `<h4>${match.name}</h4>
        <p><b>Bio:</b>  ${match.bio}</p>
        <p><b>Email:</b>  ${match.email}</p>
        <p><b>Phone:</b>  ${match.phone}</p>
        <p><b>Can Teach You:</b> ${listOfSkills(match.skills)}</p>
        <p><b>Wants to Learn:</b>  ${match.skills_name}</p>`
	$('#match-modal > div.modal-content').append(content)
}

function listOfSkills(array) { // THIS WORKS
	let output = array.map((el) => {
		return el.name
	}, [])
	return output.join(', ')
}

function parseJWT(token) { // THIS WORKS
	let base64Url = token.split('.')[1];
	let base64 = base64Url.replace('-', '+').replace('_', '/');
	return JSON.parse(window.atob(base64));
};

function logOut(event) { // THIS WORKS
	event.preventDefault()
	localStorage.removeItem('token')
	location.href = '/'
}

function updateImage() {
	let img = $('input[type=file]').prop('files')[0]
	let formData = new FormData()
	formData.append('image', img)
	$.ajax({
		url: `${baseURL}image/${userId}`,
		data: formData,
		processData: false,
		contentType: false,
		type: 'POST',
		success: data => {
			displayImage()
		},
		fail: error => {
			console.log(error);
		}
	})
}

function displayImage() {
	$.get(`${baseURL}users/${userId}`)
		.then(showUserProfile)
}
