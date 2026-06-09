(function () {
    const menuButton = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            const isOpen = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    document.querySelectorAll('.site-search-form').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            const input = form.querySelector('input[name="q"]');
            if (!input) {
                return;
            }
            const query = input.value.trim();
            if (!query) {
                event.preventDefault();
                window.location.href = 'search.html';
            }
        });
    });

    const slider = document.querySelector('.hero-slider');
    if (slider) {
        const slides = Array.from(slider.querySelectorAll('.hero-slide'));
        const dots = Array.from(slider.querySelectorAll('.hero-dot'));
        const prev = slider.querySelector('.hero-prev');
        const next = slider.querySelector('.hero-next');
        let current = 0;
        let timer = null;

        function setSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                setSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setSlide(current + 1);
                startTimer();
            });
        }

        slider.addEventListener('mouseenter', stopTimer);
        slider.addEventListener('mouseleave', startTimer);
        setSlide(0);
        startTimer();
    }

    const filterRoot = document.querySelector('.listing-grid, .all-search-grid');
    if (filterRoot) {
        const cards = Array.from(document.querySelectorAll('.filter-card'));
        const input = document.querySelector('.filter-input');
        const yearSelect = document.querySelector('.filter-year');
        const regionSelect = document.querySelector('.filter-region');
        const typeSelect = document.querySelector('.filter-type');
        const categorySelect = document.querySelector('.filter-category');
        const emptyText = document.querySelector('.filter-empty');
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('q') || '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilters() {
            const query = normalize(input ? input.value : '');
            const year = normalize(yearSelect ? yearSelect.value : '');
            const region = normalize(regionSelect ? regionSelect.value : '');
            const type = normalize(typeSelect ? typeSelect.value : '');
            const category = normalize(categorySelect ? categorySelect.value : '');
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.dataset.region,
                    card.dataset.type,
                    card.textContent
                ].join(' '));
                const matchesQuery = !query || haystack.indexOf(query) !== -1;
                const matchesYear = !year || normalize(card.dataset.year) === year;
                const matchesRegion = !region || normalize(card.dataset.region).indexOf(region) !== -1;
                const matchesType = !type || normalize(card.dataset.type).indexOf(type) !== -1;
                const matchesCategory = !category || haystack.indexOf(category) !== -1;
                const matches = matchesQuery && matchesYear && matchesRegion && matchesType && matchesCategory;

                card.classList.toggle('is-hidden', !matches);
                if (matches) {
                    visible += 1;
                }
            });

            if (emptyText) {
                emptyText.hidden = visible !== 0;
            }
        }

        [input, yearSelect, regionSelect, typeSelect, categorySelect].forEach(function (control) {
            if (!control) {
                return;
            }
            const eventName = control.tagName === 'INPUT' ? 'input' : 'change';
            control.addEventListener(eventName, applyFilters);
        });

        applyFilters();
    }
}());
