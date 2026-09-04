if (new URLSearchParams(location.search).get('from') === 'board') {
  document.documentElement.classList.add('skip-hero-intro');
  window.setTimeout(function () {
    document.documentElement.classList.remove('skip-hero-intro');
  }, 2000);
}
