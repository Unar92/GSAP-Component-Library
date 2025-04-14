// ON DOM READY
document.addEventListener('DOMContentLoaded', () => {
    // window.addEventListener('load', () => {
        if (document.querySelector('.js-showcase')) {
            // ==============================
            // Initial State
    
            let portfolioItems = document.querySelectorAll(
                '.js-showcase .c-portfolio-item',
            );
            let portfolioItemsChoosen = [];
            let closeBtn = document.querySelector('.js-showcase .c-cross');
    
            // show starting 4 items and hide the rest
            portfolioItems.forEach((item, i) => {
                // if(i > 3) {
                //   item.style.opacity = 0;
                //   item.style.pointerEvents = "none";
                // }else{
                portfolioItemsChoosen.push(item);
                // }
            });
    
    
            // calculate the amount of transfor x,y displacement is needed on portfolioItemsChoosen to make them appear in center of the screen 100vw, 100vh
    
            if (window.innerWidth <= 1200) {
                offset = [
                    [40, -40], // 4th
                    [-20, -10], // 3rd
                    [0, 15], // 2nd
                    [-40, 40], // 1st
                ];
            }
    
            if (window.innerWidth > 1200) {
                offset = [
                    [70, -35], // 4th
                    [-70, -10], // 3rd
                    [20, 30], // 2nd
                    [130, 40], // 1st
                ];
            }
    
            // if (window.innerWidth <= 1200) {
            //     if (document.documentElement.getAttribute('dir') === 'rtl') {
            //         offset = [
            //             [190, -30], // 4th
            //             [240, -10], // 3rd
            //             [-450, 15], // 2nd
            //             [950, 40], // 1st
            //         ];
            //     } else {
            //         offset = [
            //             [40, -40], // 4th
            //             [-20, -10], // 3rd
            //             [0, 15], // 2nd
            //             [-40, 40], // 1st
            //         ];
            //     }
            // } 
            // else {
            //     if (document.documentElement.getAttribute('dir') === 'rtl') {
            //         offset = [
            //             [590,-35], // 4th
            //             [440, 20], // 3rd
            //             [550, 40], // 2nd
            //             [520, 50], // 1st
            //         ];
            //     } 
            //     else {
            //             offset = [
            //                 [70, -35], // 4th
            //                 [-70, -10], // 3rd
            //                 [20, 30], // 2nd
            //                 [130, 40], // 1st
            //             ];
            //         }
            // }
    
            setPortfolioItemsChoosen();
    
            function setPortfolioItemsChoosen() {
                let showCase = document.querySelector('.js-showcase')?.getBoundingClientRect();
                if (!showCase) return;
                portfolioItems.forEach((item) => {
                    // set transform to default 0,0 of children
                    item.style.transform = `translate(0px, 0px) scale(0)`;
                });
                portfolioItemsChoosen.forEach((item, i) => {
                    let itemParent = item.parentElement;
    
                    // Get the distance of the item from the top left corner of the parent child i.e: .js-showcase
                    let itemRect = item.getBoundingClientRect();
    
                    let showCaseX = showCase.x;
                    let showCaseY = showCase.y;
    
                    let itemRectX = itemRect.x;
                    let itemRectY = itemRect.y;
    
                    let x = showCaseX - itemRectX;
                    let y = showCaseY - itemRectY;
    
                    let winWidth = window.innerWidth;
                    let winHeight = window.innerHeight;
    
                    // Detect if the layout is RTL
                    let isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    
                    if (winWidth > 1200) {
                        x += winWidth / 2 - itemRect.width / 2;
                        y += winHeight / 2 - itemRect.height / 2;
                    } else {
                        x += winWidth / 2 - itemRect.width / 2;
                        y += (winHeight * 0.45) - (itemRect.height / 2);
                    }
    
                    // if (window.innerWidth > 1200) {
                    //     // Adjust x for RTL layout
                    //     if (isRTL) {
                    //         x = -x; // Reverse the direction of x
                    //     }
    
                    // }
    
                    // add offset
                    if (offset[i]) {
                        x += offset[i][0];
                        y += offset[i][1];
                        // change zIndex of this item to 1
                        itemParent.style.zIndex = 1;
                    } else {
                        x += offset[0][0];
                        y += offset[0][1];
                        // change zIndex of this item to 0
                        itemParent.style.zIndex = 0;
                    }
    
                    if (winWidth <= 1200) {
                        // add transform to the item
                        item.style.transform = `translate(${x}px, ${y}px) scale(0.75)`;
                    } else {
                        // add transform to the item
                        item.style.transform = `translate(${x}px, ${y}px)`;
                    }
                });
            }
    
            function resetPortfolioItemsChoosen() {
                // when isotope plugin is used we will have to fix animation state
                portfolioItemsChoosen = [];
                // get items from portfolio which are not set to display none
                portfolioItems.forEach((item, i) => {
                    // parent is display?
                    let itemParent = item.parentElement;
                    if (itemParent.style.display != 'none') {
                        // push into portfolioItemsChoosen
                        portfolioItemsChoosen.push(item);
                    }
                });
    
                // set the initial state back.
                setPortfolioItemsChoosen();
                setupPortfolioItemsAnmation();
            }
    
            // ==============================
    
            gsap.registerPlugin(ScrollTrigger);
    
            let tlPortfolio = null;
            let tlFirstRunPortfolio = gsap.timeline({
                paused: true,
            });
    
            tlPortfolio = gsap.timeline({
                scrollTrigger: {
                    // trigger:
                    //     window.innerWidth > 1200
                    //         ? '.js-showcase'
                    //         : '.js-showcase-trigger-marker',
                    // scrub: 1,
                    // pin: false, // Turn pin on for desktop, off for mobile
                    start: 'top top',
                    end: window.innerWidth >= 1200 ? '+=50%' : '50%+=50%', // Adjust end value based on device
                },
                // on complete remove this
                // onComplete: () => {
                // }
            });
    
            function setupPortfolioItemsAnmation() {
                // update timeline values
                // tlPortfolio.clear();
    
                // if js-showcase doesnt eixsts then return
                if (!document.querySelector('.js-showcase')) return;
    
                // animate showcase .sc__heading span tags to be initial away then set to 0 on x axis
                let showcaseHeading = document.querySelector(
                    '.js-showcase .sc__heading',
                );
                let showcaseHeadingSpansOriginal =
                    showcaseHeading.querySelectorAll('span');
                let showcaseHeadingSpans = showcaseHeadingSpansOriginal;
    
                let startingSpanPoint = '350px';
                if (window.innerWidth <= 1475) {
                    startingSpanPoint = '250px';
                }
                if (window.innerWidth <= 1200) {
                    startingSpanPoint = '150px';
                }
                if (window.innerWidth <= 1200 && window.innerWidth > 900) {
                    startingSpanPoint ='16.666vw';
                }
                if (window.innerWidth <= 1200) {
                    tlFirstRunPortfolio.fromTo(
                        showcaseHeadingSpans[0],
                        {
                            y: 0,
                            opacity: 1,
                        },
                        {
                            y: '-100px',
                            opacity: 0,
                            duration: 1,
                            ease: 'power1.inOut',
                            onComplete: () => {
                                showcaseHeading.style.pointerEvents = 'none';
                            },
                            onReverseComplete: () => {
                                showcaseHeading.style.pointerEvents = 'auto';
                            },
                        },
                        0,
                    );
                    tlFirstRunPortfolio.fromTo(
                        showcaseHeadingSpans[1],
                        {
                            y: 0,
                            opacity: 1,
                        },
                        {
                            y: '100px',
                            opacity: 0,
                            duration: 1,
                            ease: 'power1.inOut',
                            onComplete: () => {
                                showcaseHeading.style.pointerEvents = 'none';
                            },
                            onReverseComplete: () => {
                                showcaseHeading.style.pointerEvents = 'auto';
                            },
                        },
                        0,
                    );
                } else {
    
                    // Assuming the text direction is stored in a variable or can be detected
                    // For demonstration, let's assume we check the dir attribute on the <html> element
                    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    
                    // Adjust starting and ending points based on text direction
                    const startingXValueLTR = '-' + startingSpanPoint;
                    const endingXValueLTR = '-100vw';
                    const startingXValueRTL = startingSpanPoint;
                    const endingXValueRTL = '100vw';
                    const startingXValueLTR2 = startingSpanPoint;
                    const endingXValueLTR2 = '100vw';
                    const startingXValueRTL2 = '-' + startingSpanPoint;
                    const endingXValueRTL2 = '-100vw';
    
                    tlFirstRunPortfolio.fromTo(
                        showcaseHeadingSpans[0],
                        {
                            x: isRTL ? startingXValueRTL : startingXValueLTR,
                            opacity: 1,
                        },
                        {
                            x: isRTL ? endingXValueRTL : endingXValueLTR,
                            opacity: 0,
                            duration: 1,
                            ease: 'power1.inOut',
                            onComplete: () => {
                                showcaseHeading.style.pointerEvents = 'none';
                            },
                            onReverseComplete: () => {
                                showcaseHeading.style.pointerEvents = 'auto';
                            },
                        },
                        0,
                    );
                    tlFirstRunPortfolio.fromTo(
                        showcaseHeadingSpans[1],
                        {
                            x: isRTL ? startingXValueRTL2 : startingXValueLTR2,
                            opacity: 1,
                        },
                        {
                            x: isRTL ? endingXValueRTL2 : endingXValueLTR2,
                            opacity: 0,
                            duration: 1,
                            ease: 'power1.inOut',
                            onComplete: () => {
                                showcaseHeading.style.pointerEvents = 'none';
                            },
                            onReverseComplete: () => {
                                showcaseHeading.style.pointerEvents = 'auto';
                            },
                        },
                        0,
                    );
                }
    
                // similarly in showcase animate c-heading to top and opacity to 0
                let showcaseCHeading = document.querySelector(
                    '.js-showcase .c-heading',
                );
                tlFirstRunPortfolio.fromTo(
                    showcaseCHeading,
                    {
                        y: 0,
                        opacity: 1,
                    },
                    {
                        y: '-100px',
                        opacity: 0,
                        duration: 1,
                        ease: 'power1.inOut',
                        // onComplete: () => {
                        //     showcaseCHeading.remove();
                        // }
                    },
                    0,
                );
    
                // similarly .bot-txt
                let showcaseBotTxt = document.querySelector(
                    '.js-showcase .bot-txt',
                );
                tlFirstRunPortfolio.fromTo(
                    showcaseBotTxt,
                    {
                        y: 0,
                        opacity: 1,
                    },
                    {
                        y: '100px',
                        opacity: 0,
                        duration: 1,
                        ease: 'power1.inOut',
                        // onComplete: () => {
                        //     showcaseBotTxt.remove();
                        // }
                    },
                    0,
                );
    
                // add 1s delay to tlFirstRunPortfolio
                let y = 0;
                tlFirstRunPortfolio.to(
                    y,
                    {
                        y: 1,
                        duration: 1,
                    },
                    0,
                );
                portfolioItemsChoosen.forEach((item, i) => {
                    tlFirstRunPortfolio.to(
                        item,
                        {
                            autoAlpha: 1,
                            x: 0,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: 'power1.inOut',
                        },
                        '-=1',
                    );
                });
    
                // similarly add .portfolio-elements by turning on opacity to 1
                let showcasePortfolioElements = document.querySelectorAll(
                    '.js-showcase .portfolio-elements',
                );
                tlFirstRunPortfolio.to(
                    showcasePortfolioElements,
                    {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power1.inOut',
                        // on start
                        onStart: () => {
                            // add active class to the parent .js-showcase-item
                            portfolioItems.forEach((item) => {
                                item.classList.add('active');
                            });
                        },
                        onReverseComplete: () => {
                            // remove active class to the parent .js-showcase-item
                            portfolioItems.forEach((item) => {
                                item.classList.remove('active');
                            });
                        },
                    },
                    0.2,
                );
    
                // similarly move .c-filter-list from left to right
                if (window.innerWidth > 1200) {
                    let showcaseFilterList = document.querySelector(
                        '.js-showcase .c-filter-list',
                    );
                    tlFirstRunPortfolio.to(
                        showcaseFilterList,
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power1.inOut',
                        },
                        0.2,
                    );
                } else {
                    // .c-filter-btn-wh is moved from left to right
                    let showcaseFilterBtnWh = document.querySelector(
                        '.js-showcase .c-filter-btn-wh',
                    );
                    tlFirstRunPortfolio.fromTo(
                        showcaseFilterBtnWh,
                        {
                            x: '-100%',
                            opacity: 0,
                        },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power1.inOut',
                        },
                        0.2,
                    );
                }
    
                // similarly add .main-cta from right to left
                let showcaseMainCta = document.querySelector(
                    '.js-showcase .main-cta',
                );
                tlFirstRunPortfolio.to(
                    showcaseMainCta,
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power1.inOut',
                    },
                    0.2,
                );
                // if less than 1200
                if (window.innerWidth <= 1200) {
                    // animagte .c-filter-btn from x - 100% to x 0
                    let showcaseFilterBtn = document.querySelector(
                        '.js-showcase .c-filter-btn',
                    );
                    tlFirstRunPortfolio.fromTo(
                        showcaseFilterBtn,
                        {
                            x: '-100%',
                            opacity: 0,
                            pointerEvents: 'none',
                        },
                        {
                            x: 0,
                            opacity: 1,
                            pointerEvents: 'auto',
                            duration: 0.5,
                            ease: 'power1.inOut',
                        },
                        0.2,
                    );
                }
    
                // similarly .c-cross from opacity 0 to 1
                tlFirstRunPortfolio.to(
                    closeBtn,
                    {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power1.inOut',
                        onStart: () => {
                            closeBtn.style.pointerEvents = 'auto';
                        },
                        onReverseComplete: () => {
                            closeBtn.style.pointerEvents = 'none';
                        },
                    },
                    0.2,
                );
    
                // similarly .c-layout-switcher
                let showcaseLayoutSwitcher = document.querySelector(
                    '.js-showcase .c-layout-switcher',
                );
                tlFirstRunPortfolio.to(
                    showcaseLayoutSwitcher,
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power1.inOut',
                    },
                    0.2,
                );
    
                // add tlFirstRunPortfolio to tlPortfolio in a way that it is triggered only once when user reaches this section and pin scrolling is triggered
                let x = { value: 0 };
                let flag = false; // declare a flag
    
                // tlPortfolio.to(
                //     x,
                //     {
                //         value: 1,
                //         duration: 1,
                //         onUpdate: () => {
                //             if (x.value > 0.2 && !flag) {
                //                 // check the flag
                //                 tlFirstRunPortfolio.play();
                //                 activateDragAnimation();
                //                 // flag = true; // set the flag to true after the function is called
                //             }
                //         },
                //     },
                //     0,
                // );
            }
            setupPortfolioItemsAnmation();
    
            // js-drag-this is larger than its parent js-drag-inside
            // js-drag-this is draggable inside js-drag-inside using mouse or touch
            // The drag will stop at the edges of js-drag-inside, i.e once its bottom right
            // corner touches the bottom right corner of js-drag-inside it will stop and same for top left.
    
            let dragThis = document.querySelector('.js-drag-this');
            let dragInside = document.querySelector('.js-drag-inside');
    
            // if RTL
            if (document.documentElement.getAttribute('dir') === 'rtl') {
                // init isotope with RTL settings.
                $('.js-drag-this .showcase-list-wrap').isotope({
                    itemSelector: '.js-showcase-item',
                    layoutMode: 'fitRows',
                    transitionDuration: '1s',
                    isOriginLeft: false, // Ensures items are laid out from the right
                });
    
                let jsListToFilter = $('.js-list-to-filter').isotope({
                    itemSelector: '.js-showcase-item',
                    layoutMode: 'fitRows',
                    transitionDuration: '1s',
                    isOriginLeft: false, // Ensures items are laid out from the right
                });
    
                jsListToFilter.isotope({
                    hiddenStyle: {
                        opacity: 0,
                    },
                    visibleStyle: {
                        opacity: 1,
                    },
                });
    
                // Adjust item positions to reflect RTL layout
                jsListToFilter.on('arrangeComplete', function() {
                    jsListToFilter.find('.js-showcase-item').each(function() {
                        let $this = $(this);
                        let left = parseFloat($this.css('left'));
                        let containerWidth = jsListToFilter.width();
                        $this.css({
                            'right': containerWidth - left - $this.outerWidth(),
                            'left': 'auto'
                        });
                    });
                });
    
                // on .js-showcase-item isotope update scroll the showcase to the top
                $('.js-list-to-filter').isotope('on', 'arrangeComplete', function () {
                    let showcase = document.querySelector('.js-showcase');
                    gsap.to(showcase, {
                        scrollTop: 0,
                        duration: 1,
                        ease: 'power1.inOut',
                    });
                });
            } else {
                 // init isotope.
                $('.js-drag-this .showcase-list-wrap').isotope({
                    itemSelector: '.js-showcase-item',
                    layoutMode: 'fitRows',
                    transitionDuration: '1s',
                });
                let jsListToFilter = $('.js-list-to-filter').isotope({
                    itemSelector: '.js-showcase-item',
                    layoutMode: 'fitRows',
                    transitionDuration: '1s',
                });
                jsListToFilter.isotope({
                    hiddenStyle: {
                        opacity: 0,
                    },
                    visibleStyle: {
                        opacity: 1,
                    },
                });
    
                // on .js-showcase-item isotope update scroll the showcase to the top
                $('.js-list-to-filter').isotope('on', 'arrangeComplete', function () {
                    let showcase = document.querySelector('.js-showcase');
                    gsap.to(showcase, {
                        scrollTop: 0,
                        duration: 1,
                        ease: 'power1.inOut',
                    });
                });
            }
    
            // get all the element with attribute data-href and add click event to open the link
            let dataHref = document.querySelectorAll('[data-href');
            dataHref.forEach((elem) => {
                // if click and dragged then dont trigger click even otherwise trigger click
                let isDragging = false;
                let draggStopped = null;
                elem.addEventListener('mousedown', () => {
                    clearTimeout(draggStopped);
                    isDragging = false;
                });
                elem.addEventListener('mousemove', () => {
                    clearTimeout(draggStopped);
                    isDragging = true;
                });
                elem.addEventListener('mouseup', () => {
                    draggStopped = setTimeout(() => {
                        isDragging = false;
                    }, 100);
                });
                elem.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (!isDragging) {
                        window.location.href = elem.getAttribute('data-href');
                    }
                });
            });
    
            // Checking window width whether it is greater than 1200 or not
            function activateDragAnimation() {
                if (window.innerWidth > 1200 && dragThis && dragInside) {
                    let mc = new Hammer(dragThis);
                    let currentX = 0;
                    let currentY = 0;
    
                    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    
                    dragThis.style.cursor = 'grab';
    
                    // on pan start
                    mc.on('panstart', function (ev) {
                        // current x, y added to the new x, y if transform is already applied
                        if (dragThis.style.transform) {
                            let currentTransform = dragThis.style.transform;
    
                            let currentTransformArray = currentTransform.split(' ');
                            currentX = parseInt(
                                currentTransformArray[0]
                                    .replace('px', '')
                                    .replace('translate(', ''),
                            );
                            currentY = parseInt(
                                currentTransformArray[1].replace('px', ''),
                            );
                        }
    
                        dragThis.style.cursor = 'grabbing';
                    });
    
                    mc.on('panend', function (ev) {
                        dragThis.style.cursor = 'grab';
                    });
    
                    mc.on('pan', function (ev) {
                        let x = ev.deltaX + currentX;
                        let y = ev.deltaY + currentY;
    
                        let dragThisRect = dragThis.getBoundingClientRect();
                        let containerRect = dragInside.getBoundingClientRect();
    
                        // remove containerRect Width from dragThisRect
                        //if rtl
                        let xOffset = 0;
                        if (document.documentElement.getAttribute('dir') === 'rtl') {
                            xOffset = dragThisRect.width - containerRect.width;
                        }
                        else {
                            xOffset = containerRect.width - dragThisRect.width;
                        }
    
    
                        let yOffset = containerRect.height - dragThisRect.height;
    
                        if (document.documentElement.getAttribute('dir') === 'rtl') {
                            x = Math.max(x, 0);
                            x = Math.min(x, xOffset);
                        }
                        else {
                            x = Math.max(x, xOffset);
                            x = Math.min(x, 0);
                        }
    
    
    
                        y = Math.max(y, yOffset);
                        y = Math.min(y, 0);
    
                        dragThis.style.transform = `translate(${x}px, ${y}px)`;
                    });
                }
            }
    
            // Call the function after the animation is completed
            setupPortfolioItemsAnmation(); // Assuming this is the animation function
    
            // .js-showcase-filter
            let filterButtons = document.querySelectorAll('.js-showcase-filter');
            filterButtons.forEach((button) => {
                button.addEventListener('click', filterShowcaseItems);
            });
    
            function filterShowcaseItems(e) {
                let filterValue = '.' + e.target.getAttribute('data-target');
                if (filterValue == '.') {
                    filterValue = '*';
                }
                $('.js-drag-this .showcase-list-wrap, .js-list-to-filter').isotope({
                    filter: filterValue,
                });
                jumpDragThisToCorner();
                // active class
                filterButtons.forEach((button) => {
                    button.classList.remove('active');
                });
                if (!e.target.classList.contains('c-cross')) {
                    e.target.classList.add('active');
                }
    
                // trigger click on .js-showcase-filter-toggle
                let showcaseFilterToggle = document.querySelector(
                    '.js-showcase-filter-toggle',
                );
                showcaseFilterToggle.click();
    
                // get the inner html of filter button and put it in .js-showcase-filter-toggle .all
                let selectedItemText = '';
                if (!e.target.classList.contains('c-cross')) {
                    selectedItemText = e.target.innerHTML;
                }
                let showcaseFilterToggelBtn = document.querySelector(
                    '.js-showcase-filter-toggle .txt',
                );
                showcaseFilterToggelBtn.innerHTML = selectedItemText;
    
                // scroll dragInside to x & y 0
                gsap.to('.js-drag-inside', {
                    scrollTop: 0,
                    scrollLeft: 0,
                    duration: 1,
                    ease: 'power1.inOut',
                });
            }
    
            function jumpDragThisToCorner() {
                // $('.js-drag-this ul').isotope({ filter: '.metal' })
                //
                let currentX = 0;
                let currentY = 0;
                if (dragThis.style.transform) {
                    currentX = parseInt(
                        dragThis.style.transform
                            .split(' ')[0]
                            .replace('px', '')
                            .replace('translate(', '')
                            .replace(',', ''),
                    );
                    currentY = parseInt(
                        dragThis.style.transform
                            .split(' ')[1]
                            .replace('px', '')
                            .replace(')', ''),
                    );
                }
                gsap.fromTo(
                    dragThis,
                    {
                        x: currentX,
                        y: currentY,
                    },
                    {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: 'power1.inOut',
                    },
                );
            }
    
            // on clicking .js-switch-showcase-layout
            let switchShowcaseLayout = document.querySelector(
                '.js-switch-showcase-layout input',
            );
            let gridLayout = document.querySelector('.js-grid-layout');
            let listLayout = document.querySelector('.js-list-layout');
            const ourworkNavBtns = document.querySelectorAll('.js-ourwork-nav-btn');
    
            let switchLayoutTimeline = gsap.timeline({
                paused: true,
            });
    
            switchLayoutTimeline.fromTo(
                gridLayout,
                {
                    opacity: 1,
                },
                {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power1.inOut',
                    // on complete
                    onComplete: () => {
                        gridLayout.style.pointerEvents = 'none';
                    },
                    onReverseComplete: () => {
                        gridLayout.style.pointerEvents = 'auto';
                    },
                },
                0,
            );
            switchLayoutTimeline.fromTo(
                listLayout,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power1.inOut',
                    // on complete
                    onComplete: () => {
                        listLayout.style.pointerEvents = 'auto';
                    },
                    onReverseComplete: () => {
                        listLayout.style.pointerEvents = 'none';
                    },
                },
                0,
            );
    
            // on switcher input check box change
            switchShowcaseLayout?.addEventListener('change', function () {
                if (this.checked) {
                    switchLayoutTimeline.play();
                    ourworkNavBtns.style.pointerEvents = 'none';
                    ourworkNavBtns.style.opacity = '0';
                } else {
                    switchLayoutTimeline.reverse();
                    ourworkNavBtns.style.pointerEvents = 'auto';
                    ourworkNavBtns.style.opacity = '1';
                }
            });
    
            // ==============================
            // Filter Toggle
    
            // js-showcase-filter-toggle
            let showcaseFilterToggle = document.querySelectorAll(
                '.js-showcase-filter-toggle',
            );
            // on click
            showcaseFilterToggle.forEach((elem) => {
                elem.addEventListener('click', function () {
                    // toggle class active on .c-filter-list
                    let showCaseSec = document.querySelector('.js-showcase');
                    showCaseSec.classList.toggle('active-filter');
                });
            });
    
            // END OF Filter Toggle
            // ==============================
    
            let showCaseSec = document.querySelector('.js-showcase');
            let showCaseExploreBtn = document.querySelector('.js-explore-btn');
    
            // Open Showcase on Portfolio Section click
            // check if ShoCase has active class
            // if (showCaseSec.classList.contains('active'))
            //      {
            //         hideHeader()
            //      }
    
            if (window.innerWidth > 1200) {
                showCaseSec.addEventListener('click', () => {
                    if (!showCaseSec.classList.contains('active')) {
                        openShowCase();
                        // setTimeout(() => {
                        //     hideHeader();
                        // }, 600);
                    }
                });
            }
    
            
    
            // Reverse the Portfolio items animation on close button click
            closeBtn.addEventListener('click', closeShowCase);
    
            // Reverse the Portfolio items animation when Esc key is pressed while the showcase is open
            document.addEventListener('keydown', (e) => {
                if (
                    e.key === 'Escape' &&
                    showCaseSec.classList.contains('active')
                ) {
                    closeShowCase();
                }
            });
    
            // Reverse the portfolio items animation when the user scrolls down while the showcase is open
            // > 1200
            // if (window.innerWidth > 1200) {
            //     window.addEventListener('scroll', () => {
            //         if (showCaseSec.classList.contains('active')) {
            //             // if  tlFirstRunPortfolio.play(); is playing then return
            //             if (tlFirstRunPortfolio.time() < 1) return;
            //             // if  tlFirstRunPortfolio is complete
            //             if (tlFirstRunPortfolio.time() == 1) {
            //                 closeShowCase();
            //             }
            //         }
            //     });
            // }
    
            function openShowCase() {
                // remove scroll padding top from html
                document.documentElement.style.scrollPaddingTop = '0';
    
                // Bring the ShowCaseSec top to the screen top
                showCaseSec.scrollIntoView({
                    behavior: 'instant',
                    block: 'start',
                });
                if (window.innerWidth <= 1200) {
                    // Hide explore btn
                    showCaseExploreBtn.style.opacity = '0';
                    showCaseExploreBtn.style.pointerEvents = 'none';
                }
    
                // add active class to showCaseSec
                showCaseSec.classList.add('active');
                tlFirstRunPortfolio.play();
                activateDragAnimation();
                
                setTimeout(() => {
    
                    // disable scroll on body
                    document.body.style.overflow = 'hidden';
                    // disable scroll on html
                    document.documentElement.style.overflow = 'hidden';
    
                    scrollPosition = window.pageYOffset;
                    document.body.style.position = 'fixed';
                    document.body.style.top = `-${scrollPosition}px`;
    
                }, 300);
            
            }
    
            function closeShowCase() {
                let showCaseSec = document.querySelector('.js-showcase');
                let showAllBtn = document.querySelector('.c-filter-btn-wh');
                let switchShowcaseLayout = document.querySelector(
                    '.js-switch-showcase-layout input',
                );
    
                // Hide explore btn
                if (window.innerWidth <= 1200) {
                    showCaseExploreBtn.style.opacity = '1';
                    showCaseExploreBtn.style.pointerEvents = 'auto';
                }
                // Reset filters and show all items
                $('.js-drag-this .showcase-list-wrap, .js-list-to-filter').isotope({
                    filter: '*',
                });
    
                // Reset the cards to their initial position if dragged inside the showcase
                jumpDragThisToCorner();
    
                // < 1200
                if (window.innerWidth <= 1200) {
                    // set dragInside scroll left to 0
                    gsap.to('.js-drag-inside', {
                        scrollLeft: 0,
                        duration: 1,
                        ease: 'power1.inOut',
                    });
                    // similary scroll top to 0
                    gsap.to('.js-drag-inside', {
                        scrollTop: 0,
                        duration: 1,
                        ease: 'power1.inOut',
                    });
                }
    
                // remove active class from all filter buttons
                filterButtons.forEach((button) => {
                    button.classList.remove('active');
                });
                // add active class to show all button
                showAllBtn.classList.add('active');
    
                if (switchShowcaseLayout.checked) {
                    switchLayoutTimeline.reverse();
                    switchShowcaseLayout.checked = false;
                }
    
                setTimeout(() => {
                    tlFirstRunPortfolio.reverse();
                    showCaseSec.classList.remove('active');
    
                    // enable scroll on body
                    document.body.style.overflow = 'auto';
                    // enable scroll on html
                    document.documentElement.style.overflow = 'auto';
                    document.body.style.top = '';
                    document.body.style.position = 'relative';
                    window.scrollTo(
                        {
                            top: scrollPosition,
                            left: 0,
                            behavior: 'instant'
                        });
                    
                },);
    
                
                // add scroll padding top from html
                document.documentElement.style.scrollPaddingTop = '70px';
            }
    
            // ============ Navigation in grid showcase ============
            const ourworkNavLeftArrow = document.querySelector('.js-left-arrow');
            const ourworkNavRightArrow = document.querySelector('.js-right-arrow');
            const portfolioItem = document.querySelector(
                '.js-showcase .c-portfolio-item',
            );
            const portfolioItemWidth = portfolioItem.clientWidth;
    
            function dragInsideWithClick(e) {
                let currentX = 0;
                let currentY = 0;
                if (dragThis.style.transform) {
                    currentTransform = dragThis.style.transform;
                    let currentTransformArray = currentTransform.split(' ');
                    currentX = parseInt(
                        currentTransformArray[0]
                            .replace('px', '')
                            .replace('translate(', ''),
                    );
                    currentY = parseInt(currentTransformArray[1].replace('px', ''));
                } else {
                    // console.log('dragThis element has no transform style set');
                }
                let x = currentX;
                let y = currentY;
                if (e.target === ourworkNavRightArrow) {
                    if (x <= window.innerWidth - dragThis.clientWidth) return;
                    dragThis.style.transition = 'all 0.3s ease-out';
                    // console.log('item width:', portfolioItemWidth);
                    x -= portfolioItemWidth;
                    dragThis.style.transform = `translate(${x}px, ${y}px)`;
                    // remove transition
                    setTimeout(() => {
                        dragThis.style.transition = 'none';
                    }, 300);
                } else if (e.target === ourworkNavLeftArrow) {
                    if (x >= 0) {
                        x = 0;
                    } else {
                        // console.log('item width:', portfolioItemWidth);
                        dragThis.style.transition = 'all 0.3s ease-out';
                        x += portfolioItemWidth;
                        setTimeout(() => {
                            dragThis.style.transition = 'none';
                        }, 300);
                    }
                    dragThis.style.transform = `translate(${x}px, ${y}px)`;
                }
            }
    
            ourworkNavLeftArrow.addEventListener('click', dragInsideWithClick);
            ourworkNavRightArrow.addEventListener('click', dragInsideWithClick);
    
    
            // shake the close button upon scroll if showcase is open
            let lastScrollTime = 0;
            let scrollTimeout;
            let scrollSpeedThreshold = 0.05; // Adjust this value as needed
    
            //if window width is greater than 1200px
            if (window.innerWidth > 1200) {
                scrollSpeedThreshold = 0.07;
            } else {
                scrollSpeedThreshold = 0.2;
            }
            
            function handleWheelEvent(e) {
                let currentTime = new Date().getTime();
                let timeDiff = currentTime - lastScrollTime;
                let scrollSpeed = Math.abs(e.deltaY) / timeDiff;
            
                // // Log the deltaY value and scroll speed
                // console.log('Wheel deltaY:', e.deltaY);
                // console.log('Time difference:', timeDiff);
                // console.log('Scroll speed:', scrollSpeed);
            
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
            
                if (scrollSpeed > scrollSpeedThreshold) {
                    // console.log('Fast scroll detected');
                    gsap.to(closeBtn, {
                        x: 5,
                        duration: 0.1,
                        ease: 'power1.inOut',
                        yoyo: true,
                        repeat: 2,
                        onComplete: () => {
                            gsap.to(closeBtn, {
                                x: 0,
                                duration: 0.1,
                                ease: 'power1.inOut',
                            });
                        }
                    });
                }
            
                scrollTimeout = setTimeout(() => {
                    lastScrollTime = currentTime;
                }, 250);
            }
    
            // For touch devices on small screens (less than 1200px)
          
                showCaseSec.addEventListener('touchstart', handleTouchStart, false);
                showCaseSec.addEventListener('touchmove', handleTouchMove, false);
    
                let xDown = null;
                let yDown = null;
    
                function handleTouchStart(evt) {
                    const firstTouch = evt.touches[0];
                    xDown = firstTouch.clientX;
                    yDown = firstTouch.clientY;
                }
    
                function handleTouchMove(evt) {
                    if (!xDown ) {
                        return;
                    }
    
                    let xUp = evt.touches[0].clientX;
                    let yUp = evt.touches[0].clientY;
    
                    let xDiff = xDown - xUp;
                    let yDiff = yDown - yUp;
    
                    if (Math.abs(xDiff) < Math.abs(yDiff)) {
                        if (yDiff > 0) {
                            // Swipe up
                            if (showCaseSec.classList.contains('active')) {
                                handleWheelEvent({
                                    deltaY: -100, // Simulate a scroll up event
                                });
                            }
                        } else {
                            // Swipe down
                            if (showCaseSec.classList.contains('active')) {
                                handleWheelEvent({
                                    deltaY: 100, // Simulate a scroll down event
                                });
                            }
                        }
                    }
    
                    // Reset values
                    xDown = null;
                    yDown = null;
                }
                // } else {
                    // For non-touch devices
                    window.addEventListener('wheel', (e) => {
                        if (showCaseSec.classList.contains('active')) {
                            handleWheelEvent(e);
                        }
                    });
                // }
    
              
           
    
           
    
           
    
           
        }
    });
    
    