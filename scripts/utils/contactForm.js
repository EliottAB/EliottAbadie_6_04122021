let modalopened = false
function displayModal() {
    const modal = document.getElementById("contact_modal")
	modal.style.display = "block"
    modalopened = true
}

function closeModal() {
    const modal = document.getElementById("contact_modal")
    modal.style.display = "none"
    modalopened = false
}