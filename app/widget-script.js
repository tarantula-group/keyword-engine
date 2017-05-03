var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        insertWidget(JSON.parse(this.response))
    }
};
xhttp.open("GET", "http://localhost:3000/widget/1", true);
xhttp.send();


function insertWidget(data) {

    var ul = document.createElement('ul');

    document.getElementById('tarantula-widget').appendChild(ul);

    data.forEach(renderProductList);

    function renderProductList(element) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = element.link;
        a.innerHTML = element.anchorText;
        li.appendChild(a)
        ul.appendChild(li);
    }
}