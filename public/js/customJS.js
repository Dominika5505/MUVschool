const tableParent = document.querySelectorAll(".show-more-td");

tableParent.forEach(node => {
    node.addEventListener("click", () => {
        const tableChild = node.parentNode.nextElementSibling;
        tableChild.classList.toggle("show-hide");
        node.classList.toggle("show-hide-animate");
    });
});


// Auto scroll on form


$(document).ready(function () {
    // Handler for .ready() called.
    if ($("#gtco-subscribe").hasClass("flash-message")) {
        $('html, body').animate({
            scrollTop: $('#gtco-subscribe').offset().top
        }, 1);
    }
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