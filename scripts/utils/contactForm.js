const modal = document.getElementById("contact_modal")
const allinput = document.querySelectorAll("#firstname, #lastname, #email, #message")
let modalopened = false
function displayModal() {
	modal.style.display = "block"
    modalopened = true
}

function closeModal() {
    modal.style.display = "none"
    modalopened = false
}

function send(){
    let send = true
    allinput.forEach(element => {    
        if (element.value == "") {
            send = false
        }
    })
    if (send == true) {
        logFormContent()
        closeModal()
    }
}