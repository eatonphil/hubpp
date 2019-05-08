const left = document.createElement('div');
document.body.appendChild(left);

const right = document.createElement('div');
document.body.appendChild(right);

async function addSortedList(listEl, r) {
  listEl.innerHTML += await r.text();
  let list = listEl.querySelector('.select-menu-list').children[0];
  Array.prototype.slice.call(list.children)
       .map(function (x) { return list.removeChild(x); })
       .sort(function (x, y) {
	 const xCount = window.localStorage.getItem(x.href) || 0;
	 const yCount = window.localStorage.getItem(y.href) || 0;
	 return yCount - xCount;
       })
       .forEach(function (x) { list.appendChild(x); });
  list.querySelectorAll('a').forEach((link) => {
    link.onclick = () => {
      window.localStorage.setItem(link.href, window.localStorage.getItem(link.href) + 1);
    };
  });
}

async function fillLeft(repo) {
  left.style.position = 'absolute';
  left.style.left = '0';
  left.style.top = '200px';
  const r = await fetch(repo + '/issues/show_menu_content?partial=issues%2Ffilters%2Flabels_content&q=is%3Aissue+is%3Aopen');
  left.innerHTML = '<h1>Labels</h1>';
  addSortedList(left, r)
}

async function fillRight(repo) {
  right.style.position = 'absolute';
  right.style.right = '0';
  right.style.top = '200px';
  const r = await fetch(repo + '/issues/show_menu_content?partial=issues%2Ffilters%2Fauthors_content&q=is%3Aopen+is%3Aissue');
  right.innerHTML = '<h1>Author</h1>';
  await addSortedList(right, r);

  right.innerHTML += '<h1>Assignee</h1>';
  const r1 = await fetch(repo + '/issues/show_menu_content?partial=issues%2Ffilters%2Fassigns_content&q=is%3Aopen+is%3Aissue');
  addSortedList(right, r1);
}


setInterval(function () {
  if (window.location.pathname.includes('/issues')) {
    const pathparts = window.location.pathname.split('/');
    if (pathparts.length < 3) {
      return;
    }
    const repo = pathparts.slice(0, 3).join('/');
    if (left.innerHTML === '') {
      fillLeft(repo);
      fillRight(repo);
    }
  } else if (left.innerHTML !== '') {
    left.innerHTML = '';
    right.innerHTML = '';
  }
}, 1000);
