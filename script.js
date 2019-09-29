"use strict";

const form = document.querySelector("form.add-task");
const editForm = document.querySelector("form.edit-task");


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

    clone.querySelector(".task button[data-action=done]").addEventListener("click", function () {
        //clone.querySelector(".task .done-status") == true;
        markAsDone(task._id);
    });

    clone.querySelector(".task form.edit-task").classList.add("hide");
    clone.querySelector(".task p[data-action=edit]").addEventListener("click", function () {
        editTask(task._id);
    });

    if (task.done == true) {
        document.querySelector(".done-list").appendChild(clone);
    } else {
        document.querySelector(".to-do-list").appendChild(clone);
    }
}

function markAsDone(id) {
    const parent = document.querySelector(`.task[data-taskid="${id}"]`);

    const data = {
        title: parent.querySelector("h1.title").textContent,
        description: parent.querySelector("p.description").textContent,
        done: true
    };

    const postData = JSON.stringify(data);
    fetch("https://kea3rdsemester-91fd.restdb.io/rest/to-do/" + id, {
            method: "put",
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
            document.querySelector(`.to-do-list .task[data-taskid="${id}"]`).remove();
        });
}

function editTask(id) {
    const formEdit = document.querySelector(`.task[data-taskid="${id}"] form.edit-task`);

    formEdit.classList.toggle("hide");

    fetch("https://kea3rdsemester-91fd.restdb.io/rest/to-do/" + id, {
            method: "get",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5d887df9fd86cb75861e2626",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(task => {
            formEdit.elements.title.value = task.title;
            formEdit.elements.desc.value = task.description;
        });

    formEdit.addEventListener("submit", e => {
        e.preventDefault();
        put(id);
    });

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

function put(id) {
    const formEdit = document.querySelector(`.task[data-taskid="${id}"] form.edit-task`);

    const data = {
        title: formEdit.elements.title.value,
        description: formEdit.elements.desc.value,
        done: false
    };

    const postData = JSON.stringify(data);
    fetch("https://kea3rdsemester-91fd.restdb.io/rest/to-do/" + id, {
            method: "put",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5d887df9fd86cb75861e2626",
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(res => res.json())
        .then(data => {
            const parent = document.querySelector(`.task[data-taskid="${id}"]`);

            parent.querySelector("h1.title").textContent = data.title;
            parent.querySelector("p.description").textContent = data.description;
        });

    formEdit.reset();
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