const tableParent = document.querySelectorAll(".show-more-td");

tableParent.forEach(node => {
    node.addEventListener("click", () => {
        const tableChild = node.parentNode.nextElementSibling;
        tableChild.classList.toggle("show-hide");
        node.classList.toggle("show-hide-animate");
    });
});

$('#myModal').modal('show');

const lines = document.querySelectorAll(".bar-line");
const list = document.querySelector(".admin-nav");
const anchorTags = document.querySelectorAll(".admin-a");
const bar = document.querySelector(".bar");

bar.addEventListener("click", function () {
    lines.forEach(line => {
        line.classList.toggle("toggle");
    });
    anchorTags.forEach(anchorTag => {
        anchorTag.classList.toggle("toggle");
    });
    list.classList.toggle("toggle");
})