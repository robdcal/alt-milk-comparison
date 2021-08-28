let observerOptions = {
    rootMargin: '0px',
    threshold: 0.5
}

var observer = new IntersectionObserver(observerCallback, observerOptions);

function observerCallback(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // console.log(entry)
            currentTopic = entry.target.dataset.topic;
            currentMeasure = entry.target.dataset.measure;
            updateChartData(currentTopic, currentMeasure)
        }
    });
};

let target = '.chart-section';
document.querySelectorAll(target).forEach((i) => {
    if (i) {
        observer.observe(i);
    }
});