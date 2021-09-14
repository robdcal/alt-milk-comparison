let observerNavOptions = {
    rootMargin: '0px',
    threshold: 0.5
}

const observerNav = new IntersectionObserver(observerNavCallback, observerNavOptions);

function observerNavCallback(entries, observerNav) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            currentId = entry.target.id;
            updateNav(currentId).then(function () {
                // history.pushState(null, null, `#${currentId}`);
            })
        }
    });
};

let targetNav = '.chart-section';
document.querySelectorAll(targetNav).forEach((i) => {
    if (i) {
        observerNav.observe(i);
    }
});

const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('[data-target]');

function updateNav(id) {
    let navTarget = document.querySelector(`[data-target=${id}`)

    // add/remove classes to display active/inactive + toggle data-active value
    // return new Promise(function (resolve, reject) {
    for (const link of navLinks) {
        if (link.getAttribute('data-active') === 'false' && link === navTarget) {
            link.classList.remove("opacity-50")
            link.classList.add("font-semibold")
            navTarget.setAttribute('data-active', 'true');
        } else if (link !== navTarget) {
            link.classList.add("opacity-50")
            link.classList.remove("font-semibold")
            link.setAttribute('data-active', 'false');
        }
    }
    navTarget.setAttribute('data-active', 'true');
    history.replaceState(null, null, `#${currentId}`);

    // resolve()
    // })

}