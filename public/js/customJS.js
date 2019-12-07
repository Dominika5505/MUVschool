const tableParent = document.querySelectorAll(".show-more-td");

tableParent.forEach(node => {
    node.addEventListener("click", () => {
        const tableChild = node.parentNode.nextElementSibling;
        tableChild.classList.toggle("show-hide");
        node.classList.toggle("show-hide-animate");
    });
});

const aboutInfHeader = document.querySelectorAll('.about-inf-header');
aboutInfHeader.forEach(about => {
    about.addEventListener('click', () => {
        // about.firstElementChild.firstElementChild.nextElementSibling.classList.toggle('roll');
        about.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.classList.toggle('roll');
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

$(document).ready(function () {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("menuDisplayed");
    });
});

let cta = document.getElementById('subscribe-submit');
let error = document.getElementById('error');
let success = document.getElementById('success');
let signup = document.getElementById('signup');
let subscribeEmail = document.getElementById('subscribeEmail');
let subscribeName = document.getElementById('subscribeName');

// $(document).ready(function () {
//     $("form#subscribe-form").on('submit', function (e) {
//         e.preventDefault();
//         var data = $('input[name=email]').val();
//         $.ajax({
//                 type: 'post',
//                 url: '/subscribe',
//                 data: data,
//                 dataType: 'text'
//             })
//             .done(function (data) {
//                 console.log('Working')
//             });
//     });
// });

cta.addEventListener('click', event => {
    event.preventDefault();
    // console.log('jo');

    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', `/subscribe`, true);

    subscribers = '';

    // xhr.onload = () => {
    //     if (xhr.status == 200) {
    //         const users = JSON.parse(xhr.responseText);
    //         console.log(users);

    //         subscribers = users.filter(user => user.email == document.getElementById('email').value);
    //         console.log('Subscribers in onloal: ' + subscribers);
    //     };
    // }


    // xhr.send();
    console.log(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.subscribeEmail.value));

    regexEmailTest = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.subscribeEmail.value);
    regexNameTest = /^(?:[A-zÀ-ú]+)(?:[A-Za-z\u0100-\u017F áéíýóúô]*)$/.test(this.subscribeName.value);

    if (this.subscribeEmail.value == null || this.subscribeEmail.value == '' || this.subscribeName.value == null || this.subscribeName.value == '') {
        error.classList.add('fadein');
        error.innerText = 'Prosím vyplň všetky polia.'
    } else if (!regexEmailTest) {
        error.classList.add('fadein');
        error.innerText = 'Nezadal si správny email.'
    } else if (!regexNameTest) {
        error.classList.add('fadein');
        error.innerText = 'Nezadal si správne meno.'
    } else {
        fetch('/subscribe')
            .then(res => res.json())
            .then(users => {
                const userEmail = users.filter(user => user.email == this.subscribeEmail.value);

                if (userEmail != '') {
                    error.classList.add('fadein');
                    error.innerText = 'Tento email je už na odber zaregistrovaný.'
                } else {
                    let fetchData = {
                        method: 'POST',
                        body: JSON.stringify({
                            email: this.subscribeEmail.value,
                            name: this.subscribeName.value,
                            js: true
                        }),
                        headers: {
                            "Content-type": "application/json"
                        }
                    }

                    fetch('/subscribe', fetchData)
                        .then(res => {
                            if (res.ok) {
                                signup.classList.add('fadeout');
                                setTimeout(() => {
                                    success.classList.add('fadein');
                                    signup.style.display = 'none';
                                }, 1000);
                            }
                        })
                        .then(data => console.log(data))
                        .catch(err => console.log(err));



                    // console.log(err)
                    // error.classList.add('fadein')


                }


            });
    }


});