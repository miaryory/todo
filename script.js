"use strict";

const form = document.querySelector("form.add-task");

window.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
    get();
    document.querySelector("form.add-task .add-form").classList.add("hide");
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
    clone.querySelector(".task").dataset.taskid = task._id;
    clone.querySelector("img[data-action=delete]").addEventListener("click", function () {
        deleteTask(task._id);
    });

    if (task.done == true) {
        document.querySelector(".done-list").appendChild(clone);
    } else {
        document.querySelector(".to-do-list").appendChild(clone);
    }
}

function deleteTask(id) {
    fetch("https://kea3rdsemester-91fd.restdb.io/rest/to-do/" + id, {
            method: "delete",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5d887df9fd86cb75861e2626",
                "cache-control": "no-cache"
            }
        })
        .then(res => res.json())
        .then(data => {
            document.querySelector(`.task[data-taskid="${id}"]`).remove();
        });
}

document.querySelector("form.add-task p[data-action=add]").addEventListener("click", function () {
    document.querySelector("form.add-task .add-form").classList.toggle("hide");
});

form.addEventListener("submit", e => {

    e.preventDefault();

    const data = {
        title: form.elements.title.value,
        description: form.elements.desc.value,
        done: false
    };

    const postData = JSON.stringify(data);
    fetch("https://kea3rdsemester-91fd.restdb.io/rest/to-do", {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5d887df9fd86cb75861e2626",
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(res => res.json())
        .then(data => {
            display(data);
        });

    form.reset();
});

//document.querySelector(".task p[data-action=edit]").addEventListener("click", edit);