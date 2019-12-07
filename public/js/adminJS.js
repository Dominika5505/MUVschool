const lines = document.querySelectorAll(".bar-line");
const list = document.querySelector(".admin-nav");
const anchorTags = document.querySelectorAll(".admin-a");
const bar = document.querySelector(".bar");
console.log(bar);

bar.addEventListener("click", function () {
    lines.forEach(line => {
        line.classList.toggle("toggle");
    });
    anchorTags.forEach(anchorTag => {
        anchorTag.classList.toggle("toggle");
    });
    list.classList.toggle("toggle");
})

const checkbox = document.querySelector('#adminMessageCheckbox');

checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
        fetch('/admin/dashboard/sendMessage')
            .then(res => res.json())
            .then(data => {
                data.forEach(dat => {
                    document.querySelector('#adminMessageEmail').value += `${dat}, `
                })
                email = 'nieco';
            });
    } else {
        document.querySelector('#adminMessageEmail').value = '';
    }
})