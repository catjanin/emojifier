document.getElementById('gallery_searchbar_input').addEventListener('input', () => {
    let search = document.getElementById('gallery_searchbar_input').value;
    sortCards(search);
});

document.getElementById('cat-select').addEventListener('change', () => {
    let cat = document.getElementById('cat-select').value;
    sortCardsByCat(cat);
});

function sortCards(search) {
    let elResult = Array.from(document.getElementsByClassName('gallery_card'));

    elResult.forEach((v, i, a) => {
        let title = v.children[1].children[0].children[0].innerText;
        if (!title.includes(search)) {
            a[i].parentElement.parentElement.style.position = 'absolute';
            a[i].parentElement.parentElement.style.left = '-999999px';
        } else {
            a[i].parentElement.parentElement.style.position = 'static';
            a[i].parentElement.parentElement.style.left = '0';
        }
    })
}

function sortCardsByCat(cat) {
    let els = Array.from(document.getElementsByClassName('gallery_categ'));
    console.log(cat);
    els.forEach((v, i, a) => {
        let categ = v.innerText.split(':').pop().trim();
        if(cat === "all") {
            a[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.position = 'static';
            a[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.left = '0';
        }else{
            if (categ !== cat) {
                a[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.position = 'absolute';
                a[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.left = '-999999px';
            } else {
                a[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.position = 'static';
                a[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.left = '0';
            }
        }
    })
}