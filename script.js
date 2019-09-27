"use strict";

window.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
    get();
}

function get() {
    fetch("https://kea3rdsemester-91fd.restdb.io/rest/to-do", {
            method: "get",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5d887df9fd86cb75861e2626",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(tasks => {
            tasks.forEach(task => {
                display(task);
            });
        });
}

function display(task) {
    const template = document.querySelector("template").content;
    const clone = template.cloneNode(true);

    clone.querySelector(".task .title").textContent = task.title;
    clone.querySelector(".task .description").textContent = task.description;
    clone.querySelector("img[data-action=delete]").dataset.taskid = task._id;

    if (task.done == true) {
        document.querySelector(".done-list").appendChild(clone);
    } else {
        document.querySelector(".to-do-list").appendChild(clone);
    }


}