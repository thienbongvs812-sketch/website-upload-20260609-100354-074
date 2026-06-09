(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function initNavigation() {
        var button = document.querySelector('.nav-toggle');
        if (!button) {
            return;
        }
        button.addEventListener('click', function () {
            document.body.classList.toggle('nav-open');
        });
        document.querySelectorAll('.site-nav a').forEach(function (link) {
            link.addEventListener('click', function () {
                document.body.classList.remove('nav-open');
            });
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                show(Number(dot.getAttribute('data-slide-index') || 0));
                start();
            });
        });
        show(0);
        start();
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function initFilters() {
        document.querySelectorAll('[data-filter-root]').forEach(function (root) {
            var input = root.querySelector('.filter-input');
            var selects = Array.prototype.slice.call(root.querySelectorAll('.filter-select'));
            var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
            function apply() {
                var query = normalize(input ? input.value : '');
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute('data-text'));
                    var visible = !query || text.indexOf(query) !== -1;
                    selects.forEach(function (select) {
                        var field = select.getAttribute('data-filter-field');
                        var value = normalize(select.value);
                        if (value && normalize(card.getAttribute('data-' + field)) !== value) {
                            visible = false;
                        }
                    });
                    card.classList.toggle('is-hidden', !visible);
                });
            }
            if (input) {
                input.addEventListener('input', apply);
            }
            selects.forEach(function (select) {
                select.addEventListener('change', apply);
            });
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q && input) {
                input.value = q;
                apply();
            }
        });
    }

    ready(function () {
        initNavigation();
        initHero();
        initFilters();
    });
})();
