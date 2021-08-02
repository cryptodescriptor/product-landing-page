class productLandingPage {
	constructor() {
    this.e = {
      'aboutUs': document.querySelector('#about-us'),
      'swipeBtns': [
        document.getElementById('prev'),
        document.getElementById('next')
      ],
      'header': document.getElementById('header'),
      'ytVidSection': document.querySelector('#installation-video'),
      'subscribePopup': document.querySelector('#subscribe-popup'),
      'emailInput': document.getElementById('email')
    }

    this.headerHeight = this.e.header.clientHeight;
    this.isEdgeBrowser = navigator.userAgent.match(/Edge\/\d+/);
    this.githubRaw = 'https://raw.githubusercontent.com/cryptodescriptor';

    this.windowLoaded = false;
    window.onload = () => { this.windowLoaded = true; };
    this.tasks = [];

    this.setupSmoothScroll();
    this.loadBackgroundImage('./img/bg.jpg');
    this.fetchAndProcessPanelData();
    this.setupPageFunctionalities();
    this.revealOnLoad();
  }

  imageLoaded(bgImg) {
    let img = new Image();

    img.onload = () => {
      this.backgroundLoaded = true;
    }

    img.src = bgImg;

    if (img.complete) {
      img.onload();
    }
  }

  loadBackgroundImage(bgImg) {
    this.e.aboutUs.style.backgroundImage = `url(${bgImg})`;
    this.imageLoaded(bgImg);
  }

  setPanelHeaderImage(panel) {
    panel.querySelector('.swipe-panel-img').setAttribute('src', this.panelData['header-img']);
  }

  setPanelPriceTag(panel) {
    panel.querySelector('.price').innerHTML = this.panelData['price'];
  }

  setPanelDescription(panel) {
    panel.querySelector('.product-description').innerHTML = this.panelData['description'];
  }

  addClassesToComponentImgContainer(imgContainer) {
    imgContainer.addClasses([
      'component-img-container',
      'img-preview',
      'inline-flex',
      'flex-center'
    ]);
  }

  addClassesToComponentImg(img) {
    img.addClasses(['responsive-img-whc', 'img-preview']);
  }

  createComponentImg(imgSrc) {
    let imgContainer = document.createElement('div');
    this.addClassesToComponentImgContainer(imgContainer);
    let img = document.createElement('img');
    this.addClassesToComponentImg(img);
    img.setAttribute('src', imgSrc);
    imgContainer.appendChild(img);
    return imgContainer;
  }

  createComponentSpacer() {
    let spacer = document.createElement('div');
    spacer.addClass('component-spacer');
    return spacer;
  }

  createComponentDescription(description) {
    let componentDescription = document.createElement('div');
    componentDescription.addClass('component-description');
    componentDescription.innerHTML = description;
    return componentDescription;
  }

  createComponentDIV(imgSrc, description) {
    // Row
    let component = document.createElement('div');
    component.addClasses(['component-row', 'flex-center']);
    // Img
    component.appendChild(this.createComponentImg(imgSrc));
    // Spacer
    component.appendChild(this.createComponentSpacer());
    // Description
    component.appendChild(this.createComponentDescription(description));
    return component;
  }

  createPanelComponents(panel, JSONdata) {
    let panelBtn = panel.querySelector('.swipe-panel-body > button');
    let panelBody = panel.querySelector('.swipe-panel-body');

    this.panelData['component-data'].forEach(component => {
      let componentDIV = this.createComponentDIV(component[0], component[1]);
      panelBody.insertBefore(componentDIV, panelBtn);
    });

    JSONdata['common-images'].forEach((img, i) =>  {
      let componentDiv = this.createComponentDIV(img, this.panelData['common'][i]);
      panelBody.insertBefore(componentDiv, panelBtn);
    });
  }

  populatePanels(JSONdata) {
    let panels = ['gold', 'silver', 'bronze'];

    panels.forEach((panelName) => {
      let panel = document.querySelector('.'+panelName+'-panel')
      this.panelData = JSONdata[panelName];
      this.setPanelHeaderImage(panel);
      this.setPanelPriceTag(panel);
      this.setPanelDescription(panel);
      this.createPanelComponents(panel, JSONdata);
    });

    this.finishedPopulatingPanels = true;
  }

  fetchAndProcessPanelData() {
    fetch(this.githubRaw + '/product-landing-page/master/pond-packages.json')
    .then(response => response.json())
    .then(data => this.populatePanels(data));
  }

  imgPreviewCloseListeners(imgPreviewModal) {
    // Close on close button click
    document.querySelector('#img-preview-close-button').addEventListener('click', () => {
      imgPreviewModal.addClass('display-none');
    });

    // Close when clicked away
    imgPreviewModal.addEventListener('click', e => {
      if (e.target.id === 'img-preview-modal') {
        imgPreviewModal.addClass('display-none');
      }
    });
  }

  swipeImgPreviewFix() {
    /* Fix to prevent img preview opening during swipe (see line 298 in swipe.js) */
    window.previewImg = false;

    document.body.addEventListener('mousedown', e => {
      if (e.target.hasClass('img-preview')) window.previewImg = true;
    });
  }

  shouldNotPreview(e) {
    return !e.target.hasClass('img-preview') || !window.previewImg;
  }

  imgPreviewOpenListener(imgPreviewModal, imgPreviewModalImg) {
    document.body.addEventListener('click', e => {
      if (this.shouldNotPreview(e)) return;
      let imgSrc;
      if (e.target.hasClass('component-img-container')) {
        imgSrc = e.target.childNodes[0].getAttribute('src');
      } else {
        imgSrc = e.target.getAttribute('src');
      }
      imgPreviewModalImg.setAttribute('src', imgSrc);
      imgPreviewModal.classList.remove('display-none');
    });
  }

  setupPanelImgPreviews() {
    let imgPreviewModal = document.querySelector('#img-preview-modal');
    let imgPreviewModalImg = document.querySelector('#img-preview-container > img');
    this.imgPreviewCloseListeners(imgPreviewModal);
    this.swipeImgPreviewFix();
    this.imgPreviewOpenListener(imgPreviewModal, imgPreviewModalImg);
  }

  showNavbar(navbar) {
    navbar.style.display = 'inline-block';
    this.navShown = true;
  }

  hideNavbar(navbar) {
    navbar.style.display = 'none';
    this.navShown = false;
  }

  navFocusFix() {
    /* Moves focused navlink infront of others for outline to display properly */
    let navLinks = document.querySelectorAll('#nav-bar .nav-link');
    navLinks.forEach(navLink => {
      navLink.addEventListener('focus', e => {
        navLinks.forEach(nLink => {
          nLink.parentNode.style.zIndex = '0';
        });
        e.target.parentNode.style.zIndex = '1';
      });
    });
  }

  setupNavbar() {
    let navToggle = document.querySelector('.nav-bar-toggle');
    let navbar = document.querySelector('#nav-bar');
    this.navShown = false;
    let navToggleBubble = false;

    navToggle.addEventListener('click', () => {
      navToggleBubble = true;
      (!this.navShown) ? this.showNavbar(navbar) : this.hideNavbar(navbar);
    });

    document.addEventListener('click', e => {
      if (this.navShown && !navToggleBubble) this.hideNavbar(navbar);
      navToggleBubble = false;
    });

    this.navFocusFix();
  }

    preventBtnFocusOutline(btn) {
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
    });
  }

  swipeOnBtnClick(btn) {
    btn.addEventListener('click', e => {
      window.mySwipe[btn.id]();
      e.preventDefault();
    });
  }

  initSwiping() {
    let swipeElement = document.getElementById('mySwipe');

    window.mySwipe = new Swipe(swipeElement, {
      draggable: true
    });

    this.e.swipeBtns.forEach(btn => {
      this.preventBtnFocusOutline(btn);
      this.swipeOnBtnClick(btn);
    });
  }

  allowSwipeBlur() {
    /* Lets elements blur when swipe div is clicked (problem with swipe.js) */
    document.querySelector('#accessories').addEventListener('click', e => {
      document.activeElement.blur();
    });
  }

  setSwipeBtnsTop(top) {
    this.e.swipeBtns.forEach(btn => { btn.style.top = top; });
  }

  setSwipeBtnsPos() {
    let aboutUs = this.e.aboutUs;
    if (window.scrollY > (aboutUs.clientHeight - this.headerHeight)) {
      this.setSwipeBtnsTop(this.headerHeight + 'px');
    } else {
      this.setSwipeBtnsTop(aboutUs.clientHeight - window.scrollY + 'px');
    }
  }

  swipeBtnsPositioning() {
    this.setSwipeBtnsPos();

    window.onresize = () => {
      this.setSwipeBtnsPos();
    };

    window.onscroll = () => {
      this.setSwipeBtnsPos();
    };
  }

  setupSwipe() {
    this.initSwiping();
    this.allowSwipeBlur();
    this.swipeBtnsPositioning();
  }

  initSmoothScrollListener() {
    let scrollAnchor = document.querySelector('.scroll-anchor');
    let yOffset = window.scrollY;

    window.addEventListener('scroll', () => {
      if (yOffset === 0) {
        window.scrollTo(0, 0);
        scrollAnchor.click();
      }
    },
    { 'once': true });
  }

  setupSmoothScroll() {
    this.smooth = new SmoothScroll('.smooth-scroll', {
      speed: 500,
      speedAsDuration: false,
      updateURL: true,
      popstate: false
    });

    if (!this.isEdgeBrowser) {
      this.initSmoothScrollListener();
    }
  }

  loadYTAsync() {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  setupYTSectionHiddenGetter() {
    Object.defineProperty(this.e.ytVidSection, 'isHidden', { 
      get: () => {
        return this.e.ytVidSection.hasClass('display-none'); 
      } 
    });
  }

  createYTCloseButtonAnchor() {
    let a = document.createElement('a');
    a.addClass('close-button');
    a.id = 'youtube-close-button';
    a.href = '#';
    a.tabIndex = 0;
    return a;
  }

  appendYTCloseButtonX(a) {
    let times = document.createElement('i');
    ['fas', 'fa-times'].forEach(c => { times.addClass(c) });
    a.appendChild(times);
  }

  hideYTVidSection() {
    if (typeof this.player.pauseVideo !== 'undefined') {
      this.player.pauseVideo();
    }
    this.e.ytVidSection.addClass('display-none');
  }

  revealYTVidSection() {
    this.e.ytVidSection.classList.remove('display-none');
  }

  ytCloseButtonClickHandler() {
    document.querySelector('#youtube-close-button').addEventListener('click', e => {
      this.hideYTVidSection();
      // Prevent page scroll
      e.preventDefault();
    });
  }

  createYTCloseButton() {
    let a = this.createYTCloseButtonAnchor();
    this.appendYTCloseButtonX(a);
    // Align "X" centrally
    a.addClass('flex-center');
    // Prepend to #video-pane
    document.getElementById('video-pane').prepend(a);
    // Start click handler
    this.ytCloseButtonClickHandler();
  }

  onYTLoaded() {
    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('video', {
        height: '100%',
        width: '100%',
        videoId: 'YC-RVqsEmsU',
        events: {
          'onReady' : this.createYTCloseButton()
        }
      });
    };
  }

  hideYTWhenOnClickAway() {
    this.e.ytVidSection.addEventListener('click', e => {
      if (e.target.id === 'installation-video') {
        this.hideYTVidSection();
      }
    });
  }

  revealYTOnPageLoad() {
    if (window.location.hash === '#installation-video') {
      this.revealYTVidSection();
    }
  }

  showOrHideYTOnNavigation() {
    window.addEventListener('hashchange', () => {
      if (window.location.hash !== '#installation-video' && !this.e.ytVidSection.isHidden)
        this.hideYTVidSection();
      else if (window.location.hash === '#installation-video' && this.e.ytVidSection.isHidden)
        this.revealYTVidSection();
    });
  }

  setupYoutube() {
    this.onYTLoaded();
    this.loadYTAsync();
    this.setupYTSectionHiddenGetter();
    this.hideYTWhenOnClickAway();
    this.revealYTOnPageLoad();
    this.showOrHideYTOnNavigation();
  }

  subscribePos() {
    this.e.subscribePopup.style.bottom = '-' + (this.e.subscribePopup.clientHeight + 12) + 'px';
  }

  subscribePopupCloseListener() {
    document.querySelector('#subscribe-close-button').addEventListener('click', () => {
      this.e.subscribePopup.addClass('display-none').bind(this);
    });
  }

  subscribeReveal(e) {
    e.preventDefault();
    this.e.subscribePopup.classList.remove('display-none');
    this.e.emailInput.focus();
  }

  doSubscribePopupTranslate() {
    let offset = parseInt(this.e.subscribePopup.style.bottom);
    this.e.subscribePopup.style.transform = 'translateY('+offset+'px)';
  }

  subscribePopupTranslateY() {
    this.onWindowLoaded(() => {
      document.querySelector('.icon-scroll').addEventListener('animationend', () => {
        window.removeEventListener('resize', this.subscribePos);
        this.doSubscribePopupTranslate();
      }, {'once': true});
    });
  }

  intialSubscribeReveal() {
    // Slides subscribe popup into view
    this.e.subscribePopup.addEventListener('transitionend', () => {
      this.e.subscribePopup.classList.remove('subscribe--animatable');
    });

    this.subscribePopupTranslateY();
  }

  subscribePopupListeners() {
    this.onWindowLoaded(() => { this.subscribePos(); });
    window.addEventListener('resize', this.subscribePos);
    this.subscribePopupCloseListener();
  }

  setupPageFunctionalities() {
    this.setupPanelImgPreviews();
    this.setupNavbar();
    this.setupSwipe();
    this.setupYoutube();
    this.subscribePopupListeners();
  }

  doTasks() {
    if (!this.windowLoaded) return;
    window.clearInterval(this.checkWindowLoadedInterval);
    this.tasks.forEach(task => { task(); });
  }

  onWindowLoaded(callback) {
    if (this.windowLoaded) return callback();
    this.tasks.push(callback);
    if (this.checkWindowLoadedInterval === undefined) {
      this.checkWindowLoadedInterval = window.setInterval(this.doTasks.bind(this), 50);
    }
  }

  startScrollAnimation() {
    document.querySelector('.icon-scroll').pseudoStyle('before', 'animation-name', 'scroll');
  }

  revealDocBody() {
    document.body.style.visibility = 'visible';
  }

  revealSwipe() {
    document.querySelector('.swipe-wrap').style.visibility = 'visible';
  }

  startScrollAnimation() {
    document.querySelector('.icon-scroll').pseudoStyle('before', 'animation-name', 'scroll');
  }

  revealPage() {
    this.revealDocBody();
    this.revealSwipe();
    this.isEdgeBrowser ? onWindowLoaded(this.startScrollAnimation) : this.startScrollAnimation();
    this.intialSubscribeReveal();
    clearInterval(this.checkLoaded);
  }

  revealOnLoad() {
    this.checkLoaded = window.setInterval(() => {
      if (
        document.documentElement.classList.contains('fontawesome-i2svg-active')
        && this.backgroundLoaded
        && this.finishedPopulatingPanels) {
        this.revealPage();
      }
    }, 50);
  }
}

var plp = new productLandingPage();