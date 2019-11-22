const tableParent = document.querySelectorAll(".show-more-td");

tableParent.forEach(node => {
    node.addEventListener("click", () => {
        const tableChild = node.parentNode.nextElementSibling;
        tableChild.classList.toggle("show-hide");
        node.classList.toggle("show-hide-animate");
    });
});

const courseContainer = document.querySelectorAll('.course-img-overlay');

courseContainer.forEach(con => {
    con.addEventListener('click', () => {
        con.firstElementChild.classList.toggle('display');
        con.querySelector('.course-info2').classList.toggle('display');

    })
})

// Auto scroll on form


// $(document).ready(function () {
//     // Handler for .ready() called.
//     if ($("#gtco-level2").hasClass("flash-message")) {
//         $('html, body').animate({
//             scrollTop: $('#gtco-level2').offset().top
//         }, 1);
//     }
// });

$('#myModal').modal('show');
if ($('#gtco-level2').hasClass('flash-message')) {
    $('#modalLevel2').modal('show');
}
if ($('#gtco-level1').hasClass('flash-message')) {
    $('#modalLevel1').modal('show');
}

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