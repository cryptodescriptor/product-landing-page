// PROTOTYPES

var UID = {
  _current: 0,
  getNew: function(){
    this._current++;
    return this._current;
  }
};

/* proto allows editing of pseudo element styles */
HTMLElement.prototype.pseudoStyle = function(element,prop,value) {
  var _this = this;
  var _sheetId = "pseudoStyles";
  var _head = document.head || document.getElementsByTagName('head')[0];
  var _sheet = document.getElementById(_sheetId) || document.createElement('style');
  _sheet.id = _sheetId;
  var className = "pseudoStyle" + UID.getNew();
  
  _this.className +=  " "+className; 
  
  _sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
  _head.appendChild(_sheet);
  return this;
};

Object.prototype.hasClass = function(className) {
  return (this.classList.contains(className));
};

// OTHER STUFF

/* Firefox isn't letting me add a window load eventListener 
inside setInterval context, this is a workaround. */  

var windowLoaded = false,
  checkWindowLoadedInterval,
  windowLoaded = false,
  tasks = [];

window.onload = function() {
  windowLoaded = true;
}

function onWindowLoaded(callback) {
  if (windowLoaded) {
    callback();
    return;
  }

  tasks.push(callback);

  if (checkWindowLoadedInterval === undefined) {
    checkWindowLoadedInterval = setInterval(function() {
      if (windowLoaded) {
        // clear interval and execute tasks
        clearInterval(checkWindowLoadedInterval);
        tasks.forEach(function(task) {
          task();
        });
      }
    }, 50);
  }
}

/* Check if client is using Edge */
var isEdge = navigator.userAgent.match(/Edge\/\d+/);

// SMOOTH SCROLL

var smooth = new SmoothScroll('.nav-link:not(.no-smooth)', {
  speed: 500,
  speedAsDuration: false,
  updateURL: true,
  popstate: false
});

// Autoscroll the page to #accessories if we were at 0

if (!isEdge) {
  var autoScrolled = false,
  autoScrollAnchor = document.querySelector('.autoScrollAnchor'),
  prevTop = document.body.scrollTop;

  function autoScroll(event) {
    if (autoScrolled === false && document.body.scrollTop >= 0 && prevTop === 0) {
      window.scrollTo(0, 0); // prevent small offset on back button
      autoScrollAnchor.click();
      window.removeEventListener('scroll', autoScroll);
    }
  }

  window.addEventListener('scroll', autoScroll);
}

// SWIPE

var swipeElement = document.getElementById('mySwipe');

window.mySwipe = new Swipe(swipeElement, {
  draggable:true
});

var prevBtn = document.getElementById('prev'),
  nextBtn = document.getElementById('next'),
  swipeBtns = [prevBtn, nextBtn];


swipeBtns.forEach(function(btn) {
  // stop the button from being focused when clicked
  btn.addEventListener('mousedown', function(e) {
    e.preventDefault();
  });

  // swipe when clicked
  btn.addEventListener('click', function(e) {
    mySwipe[this.id]();
    this.blur();
    e.preventDefault();
  });
});

// allow elements to blur when swipe is clicked
document.addEventListener('click', function(e) {
  if (
      e.target !== document.activeElement &&
      !e.target.classList.contains('blur-exception') &&
      !document.activeElement.contains(e.target) /*  <--
      fix bug where activeElement would be unfocused if a
      child element of the activeElement was the target. */
    ) {
      document.activeElement.blur();
  }
});

// keep swipe controller buttons on screen as we scroll down the page
var about = document.querySelector('#about-us');

function setButtonsTop(top) {
  swipeBtns.forEach(function(btn) { btn.style.top = top; });
}

function positionButtons() {
  if (window.scrollY > (about.clientHeight - 60)) {
    setButtonsTop(60 + 'px');
  } else {
    setButtonsTop(about.clientHeight - window.scrollY + 'px');
  }
}

positionButtons(); // initial position

// re-position on page resize and also on scroll
window.addEventListener('resize', function() {
  positionButtons();
});

window.onscroll = function() {
  positionButtons();
};

// IMG PREVIEW's

var imgPreviewModal = document.querySelector('#img-preview-modal'),
  imgPreviewModalImg = document.querySelector('#img-preview-container > img');

// close image preview if button is clicked or if the panel is clicked away from
document.querySelector('#img-preview-close-button').addEventListener('click', function() {
  imgPreviewModal.addClass('display-none');
});

imgPreviewModal.addEventListener('click', function(e) {
  if (e.target.id === 'img-preview-modal') {
    imgPreviewModal.addClass('display-none');
  }
});

/* fix to prevent img preview opening when started swiping (see line 299 in swipe.js) */
window.previewImg = false;

// using doc.body instead of .img-preview to prevent a bug after swiping
document.body.addEventListener('mousedown', function(e) {
  if (e.target.hasClass('img-preview')) {
      window.previewImg = true;
  }
});
/* end fix */

// open image preview when swipe image is clicked

// using doc.body instead of .img-preview to prevent a bug after swiping
document.body.addEventListener('click', function(e) {
  if (!e.target.hasClass('img-preview') || !window.previewImg) {
    return;
  }

  var imgSrc;

  if (e.target.hasClass('component-img-container')) {
    imgSrc = e.target.childNodes[0].getAttribute('src');
  } else {
    imgSrc = e.target.getAttribute('src');
  }

  // set imgPreviewModal src
  imgPreviewModalImg.setAttribute('src', imgSrc);

  // show imgPreviewModal if it is hidden
  if (imgPreviewModal.classList.contains('display-none')) {
    imgPreviewModal.classList.remove('display-none');
  }
});

// NAVBAR

var navToggle = document.querySelector('.nav-bar-toggle');
var navbar = document.querySelector('#nav-bar');

var navShown = false;

function showNavbar() {
  navbar.style.display = 'inline-block';
  navShown = true;
}

function hideNavbar() {
  navbar.style.display = 'none';
  navShown = false;
}

var navToggleBubble = false;

navToggle.addEventListener('click', function() {
  navToggleBubble = true;
  (!navShown) ? showNavbar() : hideNavbar();
});

document.addEventListener('click', function(e) {
  // hide nav if clicked away from or if dropdown link was clicked
  if (navShown && !navToggleBubble || navShown && e.target.hasClass('nav-link')) {
    hideNavbar();
  }
  navToggleBubble = false;
});

// keep focused .nav-link infront of the others to allow outline
// to display correctly
var navLinks = document.querySelectorAll('#nav-bar .nav-link');

navLinks.forEach(function(navLink) {
  navLink.addEventListener('focus', function(e) {
    navLinks.forEach(function(nLink) {
      nLink.parentNode.style.zIndex = '0';
    });
    e.target.parentNode.style.zIndex = '1';
  });
});

// LOAD BG IMG

var bg_url = './img/bg.jpg';

about.style.backgroundImage = 'url('+bg_url+')';

var bg_loaded = false;

function imgLoaded() {
  var img = new Image();

  img.onload = function() {
    bg_loaded = true;
  }

  img.src = bg_url;

  if (img.complete) img.onload();
}

imgLoaded();

// POPULATE PANEL'S WITH DATA AND IMAGES

var panelNames = ['gold', 'silver', 'bronze'];
var populatedPanels = false;

Object.prototype.addClass = function(className) {
  this.classList.add(className);
}

Object.prototype.addClasses = function(classes) {
  var self = this;

  classes.forEach(function(c) {
    self.classList.add(c);
  });
}

function createComponentImg(imgSrc) {
  var imgContainer = document.createElement('DIV');

  imgContainer.addClasses([
    'component-img-container',
    'img-preview',
    'inline-flex',
    'flex-center'
  ]);

  var img = document.createElement('IMG');
  img.addClasses(['responsive-img-whc', 'img-preview']);
  img.setAttribute('src', imgSrc);

  imgContainer.appendChild(img);

  return imgContainer;
}

function createComponentSpacer() {
  var spacer = document.createElement('DIV');
  spacer.addClass('component-spacer');
  return spacer;
}

function createComponentDescription(description) {
  var cDesc = document.createElement('DIV');
  cDesc.addClass('component-description');
  cDesc.innerHTML = description;
  return cDesc;
}

function createComponentDiv(imgSrc, description) {
  // create row
  var component = document.createElement('DIV');
  component.addClasses(['component-row', 'flex-center']);

  // append component img
  component.appendChild(createComponentImg(imgSrc));

  // create component spacer
  component.appendChild(createComponentSpacer());

  // create component description
  component.appendChild(createComponentDescription(description));

  return component;
}

function createComponents(panel, jsonData, panelData) {
  var panelBtn = panel.querySelector('.swipe-panel-body > button');
  var panelBody = panel.querySelector('.swipe-panel-body');

  panelData['component-data'].forEach(function(component) {
    var componentDiv = createComponentDiv(component[0], component[1]);
    panelBody.insertBefore(componentDiv, panelBtn);
  });

  jsonData['common-images'].forEach(function(img, i) {
    var componentDiv = createComponentDiv(img, panelData['common'][i]);
    panelBody.insertBefore(componentDiv, panelBtn);
  });
}

function populatePanels(jsonData) {
  panelNames.forEach(function(name) {
    panel = document.querySelector('.' + name + '-panel');

    var panelData = jsonData[name];

    // set header img
    panel.querySelector('.swipe-panel-img').setAttribute('src', panelData['header-img']);

    // set price
    panel.querySelector('.price').innerHTML = panelData['price'];

    // set description
    panel.querySelector('.product-description').innerHTML = panelData['description'];

    // create components
    createComponents(panel, jsonData, panelData);
  });
}

function loadJson() {
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', 'https://pianistic-subject.000webhostapp.com/pond-packages.json', true);

  req.onload = function() {
    populatePanels(req.response);
    populatedPanels = true;
  };

  req.onerror = function(e) {
    console.log('Failed to load pond-packages.json!');
  };

  req.send();
}

loadJson();

// REVEAL WHEN LOADED

function startScrollAnimation() {
  document.querySelector('.icon-scroll')
  .pseudoStyle('before', 'animation-name', 'scroll');
}

function revealPage() {
  // reveal body
  document.body.style.visibility = 'visible';

  // reveal swipe
  document.querySelector('.swipe-wrap').style.visibility = 'visible';

  // do scroll animation on pseudo element
  if (isEdge) {
    // Edge is buggy unless you wait for window load
    onWindowLoaded(function() {
      startScrollAnimation();
    });
  } else {
    startScrollAnimation();
  }

  // reveal subscribe popup and start liteners
  intialSubscribeReveal();

  // clear load check interval
  clearInterval(checkLoad);
}

var checkLoad = setInterval(function() {
  if (
      document.documentElement.classList.contains('fontawesome-i2svg-active') &&
      bg_loaded && 
      populatedPanels
    ) {
      revealPage();
  }
}, 50);

// YOUTUBE

// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. Create an <iframe> (and YouTube player)
//    after the API code downloads. Also create the close button.
var player;

function closeButtonClickHandler() {
  document.querySelector('#youtube-close-button').addEventListener('click', function(e) {
    hideYTVidSection();
    // prevent page scroll
    e.preventDefault();
  });
}

function createCloseButton() {
  // create close button a
  var a = document.createElement('a');
  a.addClass('close-button');
  a.id = 'youtube-close-button';
  a.href = '#';
  a.tabIndex = 0;
  // create and append fontawesome "X" to anchor
  var times = document.createElement('i');
  ['fas', 'fa-times'].forEach(function(c) { times.addClass(c) });
  a.appendChild(times);
  // align "X" centrally
  a.addClass('flex-center');
  // prepend to #video-pane
  document.getElementById('video-pane').prepend(a);
  // start click handler
  closeButtonClickHandler();
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('video', {
    height: '100%',
    width: '100%',
    videoId: 'YC-RVqsEmsU',
    events: {
      'onReady' : createCloseButton()
    }
  });
}

// Reveal/Hide Youtube video section
var ytVidSection = document.querySelector('#installation-video');

ytVidSection.visible = function() {
  return (!ytVidSection.hasClass('display-none'));
}

function revealYTVidSection() {
  ytVidSection.classList.remove('display-none');
}

function hideYTVidSection() {
  if (typeof player.pauseVideo !== 'undefined') {
    player.pauseVideo();
  }
  ytVidSection.addClass('display-none');
}

// hide if #video-pane was clicked away from
ytVidSection.addEventListener('click', function(e) {
  if (e.target.id === 'installation-video') {
    hideYTVidSection();
  }
});

// reveal on page load
if (window.location.hash === '#installation-video') {
  revealYTVidSection();
}

// show/hide if navigated to/away using back button
window.addEventListener('hashchange', function() {
  if (
      window.location.hash !== '#installation-video' && 
      ytVidSection.visible()
    ) {
    hideYTVidSection();
  } else if (
      window.location.hash === '#installation-video' && 
      !ytVidSection.visible()
    ) {
    revealYTVidSection();
  }
});

// SUBSCRIBE POPUP

var subscribePopup = document.querySelector('#subscribe-popup');

function subscribePos() {
  subscribePopup.style.bottom = '-' + (subscribePopup.clientHeight + 12) + 'px';
}

onWindowLoaded(subscribePos);

window.addEventListener('resize', subscribePos);

// closing and opening of subscribe popup

document.querySelector('#subscribe-close-button').addEventListener('click', function() {
  subscribePopup.addClass('display-none');
});

function doTranslate() {
  var offset = parseInt(subscribePopup.style.bottom);
  subscribePopup.style.transform = 'translateY('+offset+'px)';
  subscribePopup.style.webkitTransform = 'translateY('+offset+'px)';
}

function translateY() {
  onWindowLoaded(function() {
    // Wait 1620ms for scroll animation to complete.
    setTimeout(function() {
      window.removeEventListener('resize', subscribePos);
      doTranslate();
    }, 1620);
  });
}

function subscribeReveal(e) {
  e.preventDefault();
  subscribePopup.classList.remove('display-none');
  email.focus();
}

function intialSubscribeReveal() {
  /* Called from revealPage() function */

  // slide subscribe into view
  subscribePopup.addEventListener('transitionend', function() {
    subscribePopup.classList.remove('subscribe--animatable');
  }, true); // capturing phase

  translateY();
}