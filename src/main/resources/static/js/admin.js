let currentUser;
let usersList;
let roleList;
let contentWindowAdmin;
let contentWindowUser;
let editRow;
let deleteButtonNode;
window.onload = function() {
    initializePage().then(() => {
    });
    $(document).ready(function ($) {
        $('#tabTop').tab();
    });
};


async function initializePage(){
    await fetch('api/user')
        .then(response => response.json())
        .then(result => {
            currentUser = result;
            let navBar = document.getElementById('navbar-top');
            navBar.innerHTML += '<li class="nav-item nav-link font-weight-bold text-light">' + result.name + '&nbsp;' + '</li>\n' +
                '<li class="nav-item nav-link text-light">With roles: <span>' + result.authorities.map(r => r.name).join(', ') + '</span></li>\n';
            let horNav = document.getElementById('hornav');

            let isAdmin = (currentUser.authorities).some(el => el.name === 'ROLE_ADMIN');
            contentWindowAdmin =
                '<p  class="h2 text-dark">Admin panel</p>\n' +
                '            <ul class="nav nav-tabs" id="nav-tab tabTop" role="tablist">\n' +
                '                <li class="nav-item">\n' +
                '                    <a class="nav-link active" id="nav-users-table-tab tab" data-toggle="tab"\n' +
                '                       href="#nav-users-table" role="tab" aria-controls="nav-users-table" aria-selected="true">Users table</a>\n' +
                '                </li>\n' +
                '                <li class="nav-item">\n' +
                '                    <a class="nav-link" id="nav-new-user-tab tab" data-toggle="tab"\n' +
                '                       href="#nav-new-user" role="tab" aria-controls="nav-new-user" aria-selected="false">New User</a>\n' +
                '                </li>\n' +
                '            </ul>\n' +
                '            <div class="tab-content" id="nav-tabContent">\n' +
                '                <div class="tab-pane fade show active" id="nav-users-table" role="tabpanel" aria-labelledby="nav-users-table-tab">\n' +
                '<div class="border">\n' +
                '    <div class="row-fluid pb-2 pt-2 border">\n' +
                '        <p class="h4 text-dark pl-3 bg-light m0">All users</p>\n' +
                '    </div>\n' +
                '    <div class="row-fluid bg-white px-3 py-3">\n' +
                '        <table  id="usersTable" class="table table-striped  m0">\n' +
                '            <thead>\n' +
                '            <tr>\n' +
                '                <th scope="col">ID</td>\n' +
                '                <th scope="col">Name</td>\n' +
                '                <th scope="col">Lastname</td>\n' +
                '                <th scope="col">Age</td>\n' +
                '                <th scope="col">Email</td>\n' +
                '                <th scope="col">Roles</td>\n' +
                '                <th scope="col">Edit</td>\n' +
                '                <th scope="col">Delete</td>\n' +
                '            </tr>\n' +
                '            </thead>\n' +
                '            <tbody id="usersList"></tbody>\n' +
                '        </table>\n' +
                '    </div>\n' +
                '</div>' +
                '                </div>\n' +
                '                <div class="tab-pane fade" id="nav-new-user" role="tabpanel" aria-labelledby="nav-new-user-tab">\n' +
                '<div class="border">\n' +
                '    <div class="row-fluid pb-2 pt-2 border">\n' +
                '        <p class="h4 text-dark pl-3 bg-light m0">Add new user</p>\n' +
                '    </div>\n' +
                '    <div class="row-fluid bg-white px-3 py-3">\n' +
                '        <form method="post" action="/api/admin/add" id="addForm">\n' +
                '            <div class="col-sm-4 offset-sm-4  text-center">\n' +
                '                <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">ID</span>\n' +
                '                <input class="form-control" type="text" id="id" name="id" disabled="disabled"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-4 offset-sm-4  text-center">\n' +
                '                <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">First name</span>\n' +
                '                <input class="form-control" type="text" id="name" name="name" />\n' +
                '            </div>\n' +
                '            <div class="col-sm-4 offset-sm-4  text-center">\n' +
                '                <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Last name</span>\n' +
                '                <input class="form-control" id="surname" name="lastname"  type="text"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-4 offset-sm-4  text-center">\n' +
                '                <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Age</span>\n' +
                '                <input class="form-control" id="age" name="age"  type="number"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-4 offset-sm-4  text-center">\n' +
                '                <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Email</span>\n' +
                '                <input type="email" class="form-control" id="email" name="email"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-4 offset-sm-4  text-center">\n' +
                '                <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Password</span>\n' +
                '                <input type="password" class="form-control" id="password" name="password"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-4 offset-sm-4  text-center mb-4">\n' +
                '                <span class="align-bottom font-weight-bold text-center d-inline-block pt-3" >Role</span>\n' +
                '                <select class="form-control" size="2" aria-label="size 2 select" id="selectElementId" multiple>\n' +
                '                </select>\n' +
                '            </div>\n' +
                '            <input type="submit" class="btn btn-success form-control col-sm-2 offset-sm-5" style="vertical-align: middle" value="Add new user" id="addUserButton"/>\n' +
                '        </form>\n' +
                '    </div>\n' +
                '</div>' +
                '                </div>\n' +
                '</div>' +
                '<div class="modal fade" id="editWindow" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">\n' +
                '    <div class="modal-dialog" role="document">\n' +
                '      <div class="modal-content">\n' +
                '        <div class="modal-header">\n' +
                '          <h5 class="modal-title" id="editModalLabel">Edit user</h5>\n' +
                '          <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
                '            <span aria-hidden="true">&times;</span>\n' +
                '          </button>\n' +
                '        </div>\n' +
                '        <div class="modal-body">\n' +
                '          <form method="post" action="/api/admin/edit/" id="editForm">\n' +
                '            <div class="col-sm-6 offset-sm-3 text-center">\n' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">ID</span>\n' +
                '              <input class="form-control disabled" type="text" id="editId" name="id" />\n' +
                '            </div>\n' +
                '            <div class="col-sm-6 offset-sm-3 text-center">\n' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">First name</span>\n' +
                '              <input class="form-control" type="text" id="editName" name="name" />\n' +
                '            </div>\n' +
                '            <div class="col-sm-6 offset-sm-3 text-center">\n' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Last name</span>\n' +
                '              <input class="form-control" id="editSurname" name="lastname" type="text"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-6 offset-sm-3 text-center">\n' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Age</span>\n' +
                '              <input class="form-control" id="editAge" name="age" type="number"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-6 offset-sm-3 text-center">\n' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Email</span>\n' +
                '              <input type="email" class="form-control" id="editEmail" name="email"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-6 offset-sm-3 text-center">\n' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Password</span>\n' +
                '              <input type="password" class="form-control" id="editPassword" name="password"/>\n' +
                '            </div>\n' +
                '            <div class="col-sm-6 offset-sm-3 text-center mb-4">\n' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Role</span>\n' +
                '              <select name="roles" class="form-control" size="2" aria-label="size 2 select" id="editRoles" multiple>\n' +
                '              </select>\n' +
                '            </div>\n' +
                '            <div class="modal-footer">\n' +
                '              <input type="reset" class="btn btn-secondary" data-dismiss="modal" value="Close"/>\n' +
                '              <input type="submit" class="btn btn-primary" value="Submit"/>\n' +
                '            </div>\n' +
                '          </form>\n' +
                '        </div>\n' +
                '      </div>\n' +
                '    </div>\n' +
                '  </div>' +
                '<div class="modal fade" id="deleteWindow" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">' +
                '    <div class="modal-dialog" role="document">' +
                '      <div class="modal-content">' +
                '        <div class="modal-header">' +
                '          <h5 class="modal-title" id="deleteModalLabel">Delete user</h5>' +
                '          <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '            <span aria-hidden="true">&times;</span>' +
                '          </button>' +
                '        </div>' +
                '        <div class="modal-body">' +
                '          <form method="post" action="/api/admin/delete/" id="deleteForm">' +
                '            <div class="col-sm-6 offset-sm-3 text-center">' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">ID</span>' +
                '              <input class="form-control disabled" type="text" id="deleteId" name="id"/>' +
                '            </div>' +
                '            <div class="col-sm-6 offset-sm-3 text-center">' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">First name</span>' +
                '              <input class="form-control" type="text" id="deleteName" name="name" disabled="disabled" />' +
                '            </div>' +
                '            <div class="col-sm-6 offset-sm-3 text-center">' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Last name</span>' +
                '              <input class="form-control" id="deleteSurname" name="lastname" type="text" disabled="disabled"/>' +
                '            </div>' +
                '            <div class="col-sm-6 offset-sm-3 text-center">' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Age</span>' +
                '              <input class="form-control" id="deleteAge" name="age" type="number" disabled="disabled"/>' +
                '            </div>' +
                '            <div class="col-sm-6 offset-sm-3 text-center">' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Email</span>' +
                '              <input type="email" class="form-control" id="deleteEmail" name="email" disabled="disabled"/>' +
                '            </div>' +
                '            <div class="col-sm-6 offset-sm-3 text-center">' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Password</span>' +
                '              <input type="password" class="form-control" id="deletePassword" name="password" disabled="disabled"/>' +
                '            </div>' +
                '            <div class="col-sm-6 offset-sm-3 text-center mb-4">' +
                '              <span class="align-bottom font-weight-bold text-center d-inline-block pt-3">Role</span>' +
                '              <select name="roles" class="form-control" multiple size="2" aria-label="size 2 select" id="deleteRoles" disabled="disabled">' +
                '              </select>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '              <input type="reset" class="btn btn-secondary" data-dismiss="modal" value="Close"/>' +
                '              <input type="submit" class="btn btn-primary" value="Submit"/>' +
                '            </div>' +
                '          </form>' +
                '        </div>' +
                '      </div>' +
                '    </div>' +
                '  </div>';
            contentWindowUser =
                '<p  class="h2 text-dark">User information-page</p>\n' +
                '            <div class="border">\n' +
                '                <div class="border">\n' +
                '                    <div class="row-fluid pb-2 pt-2 border">\n' +
                '                        <p class="h4 text-dark pl-3 bg-light m0">About user</p>\n' +
                '                    </div>\n' +
                '                    <div class="row-fluid bg-white px-3 py-3">\n' +
                '                        <table  class="table table-striped bg-white m0">\n' +
                '                            <thead>\n' +
                '                            <tr>\n' +
                '                                <th scope="col">ID</td>\n' +
                '                                <th scope="col">Name</td>\n' +
                '                                <th scope="col">Lastname</td>\n' +
                '                                <th scope="col">Age</td>\n' +
                '                                <th scope="col">Email</td>\n' +
                '                                <th scope="col">Roles</td>\n' +
                '                            </tr>\n' +
                '                            </thead>\n' +
                '                            <tr>\n' +
                '                                <td><span>' + currentUser.id + '</span></td>\n' +
                '                                <td><span>' + currentUser.name + '</span></td>\n' +
                '                                <td><span>' + currentUser.lastname + '</span></td>\n' +
                '                                <td><span>' + currentUser.age + '</span></td>\n' +
                '                                <td><span>' + currentUser.email + '</span></td>\n' +
                '                                <td><span>' + currentUser.authorities.map(r => r.name).join(', ') + '</span></td>\n' +
                '                            </tr>\n' +
                '                        </table>\n' +
                '                    </div>\n' +
                '            </div>';

            if (isAdmin) {
                horNav.innerHTML = '<li class="nav-item">\n' +
                    '<a class="nav-link active" id="adminNav" href="#">Admin</a>\n' +
                    '</li>\n' +
                    '<li class="nav-item">\n' +
                    '<a class="nav-link" id="userNav" href="#">User</a>\n' +
                    '</li>';

                let contentWindow = document.getElementById('contentWindow');
                contentWindow.innerHTML = contentWindowAdmin;

                let select = document.getElementById('selectElementId');

                getRoles().then(() => {
                    roleList?.forEach(role => {
                        let opt = document.createElement('option');
                        opt.value = role.id;
                        opt.innerHTML = role.name;
                        select.appendChild(opt);
                    });
                    select = document.getElementById('editRoles');
                    roleList?.forEach(role => {
                        let opt = document.createElement('option');
                        opt.value = role.id;
                        opt.innerHTML = role.name;
                        select.appendChild(opt);
                    });
                    select = document.getElementById('deleteRoles');
                    roleList?.forEach(role => {
                        let opt = document.createElement('option');
                        opt.value = role.id;
                        opt.innerHTML = role.name;
                        select.appendChild(opt);
                    });
                });


                let table = document.getElementById('usersList');
                getUsersList().then(() => {
                    usersList.forEach(user => {
                        let row = '<tr>' +
                            '<td><span>' + user.id + '</span></td>' +
                            '<td><span>' + user.name + '</span></td>' +
                            '<td><span>' + user.lastname + '</span></td>' +
                            '<td><span>' + user.age + '</span></td>' +
                            '<td><span>' + user.email + '</span></td>' +
                            '<td hidden><span>' + user.password + '</span></td>' +
                            '<td hidden><span>' + user.authorities.map(r => r.id).join(',') +  '</span></td>' +
                            '<td><span>' + user.authorities.map(r => r.name).join(', ') + '</span></td>' +
                            '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editWindow" id="editingTRbutton">Edit</button></td>'+
                            '<td><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteWindow" id="deleteTRbutton">Delete</button></td>'+
                            '</tr>';
                        table.innerHTML += row;
                    });
                });

                const form = document.getElementById('addForm');
                form.addEventListener('submit', handleSubmit);
                let editForm = document.getElementById('editForm');
                editForm.addEventListener('submit', handleSubmit);
                let deleteForm = document.getElementById('deleteForm');
                deleteForm.addEventListener('submit', handleSubmit);
            } else {
                horNav.innerHTML += '<li class="nav-item">\n' +
                    '<a class="nav-link active" id="userNav" href="#">User</a>\n' +
                    '</li>';
                let contentWindow = document.getElementById('contentWindow');
                contentWindow.innerHTML = contentWindowUser;
            }

            $("#userNav").on("click", function () {
                $("#adminNav").removeClass("active");
                $("#userNav").addClass("active");
                let contentWindow = document.getElementById('contentWindow');
                contentWindowAdmin = contentWindow.innerHTML;
                contentWindow.innerHTML = contentWindowUser;
            });
            $("#adminNav").on("click", function () {
                $("#userNav").removeClass("active");
                $("#adminNav").addClass("active");
                let contentWindow = document.getElementById('contentWindow');
                contentWindowUser = contentWindow.innerHTML;
                contentWindow.innerHTML = contentWindowAdmin;
            });
            $('#usersTable').on('click', 'button#editingTRbutton',function (ele) {
                editRow = ele.target.parentNode.parentNode;
                var id = editRow.cells[0].textContent;
                var firstName = editRow.cells[1].textContent;
                var surname = editRow.cells[2].textContent;
                var age = editRow.cells[3].textContent;
                var email = editRow.cells[4].textContent;
                var password = editRow.cells[5].textContent;
                var role = editRow.cells[6].textContent;

                $('#editName').val(firstName);
                $('#editSurname').val(surname);
                $('#editAge').val(age);
                $('#editEmail').val(email);
                $('#editId').val(id);
                $('#editPassword').val(password);
                $.each(role.split(","), function(i,e){
                    $("#editRoles option[value='" + e + "']").prop('selected', 'selected');
                });
            });
            $('#usersTable').on('click', 'button#deleteTRbutton',function (ele) {
                //the <tr> variable is use to set the parentNode from "ele
                editRow = ele.target.parentNode.parentNode;
                //I get the value from the cells (td) using the parentNode (var tr)
                var id = editRow.cells[0].textContent;
                var firstName = editRow.cells[1].textContent;
                var surname = editRow.cells[2].textContent;
                var age = editRow.cells[3].textContent;
                var email = editRow.cells[4].textContent;
                var password = editRow.cells[5].textContent;
                var role = editRow.cells[6].textContent;

                //Prefill the fields with the gathered information
                $('#deleteName').val(firstName);
                $('#deleteSurname').val(surname);
                $('#deleteAge').val(age);
                $('#deleteEmail').val(email);
                $('#deleteId').val(id);
                $('#deletePassword').val(password);
                $.each(role.split(","), function(i,e){
                    $("#deleteRoles option[value='" + e + "']").prop('selected', 'selected');
                });
                deleteButtonNode = this;
            });
        });
}

async function handleSubmit(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let url = form.action;
    try {
        let formData = new FormData(form);

        if(url.toString().includes('/api/admin/edit')){
            url += $('#editId').val();
            $('#editWindow').modal('hide');
        }
        if(url.toString().includes('/api/admin/delete')){
            url += $('#deleteId').val();
            $('#deleteWindow').modal('hide');
            formData = null;
        }
        let responseData = await postFormFieldsAsJson({url, formData});
        if(url.toString().includes('/api/admin/add')){
            let table = document.getElementById('usersList');
            let row = '<tr>' +
                '<td><span>' + responseData.id + '</span></td>' +
                '<td><span>' + responseData.name + '</span></td>' +
                '<td><span>' + responseData.lastname + '</span></td>' +
                '<td><span>' + responseData.age + '</span></td>' +
                '<td><span>' + responseData.email + '</span></td>' +
                '<td hidden><span>' + responseData.password + '</span></td>' +
                '<td hidden><span>' + responseData.authorities.map(r => r.id).join(', ')  + '</span></td>' +
                '<td><span>' + responseData.authorities.map(r => r.name).join(', ') + '</span></td>' +
                '<td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editWindow" id="editingTRbutton">Edit</button></td>'+
                '<td><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteWindow" id="deleteTRbutton">Delete</button></td>'+
                '</tr>';
            table.innerHTML += row;
            $('[href="#nav-users-table"]').tab('show');
        }
        if(url.toString().includes('/api/admin/delete')){
            $(deleteButtonNode).closest('tr').remove()
        }
    } catch (error) {
        console.error(error);
    }
}
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}
async function postFormFieldsAsJson({url, formData}) {
    let e;
    if(url.toString().includes('/api/admin/add')){
        e = document.getElementById("selectElementId");
    } else {
        e = document.getElementById("editRoles");
    }
    let formDataJsonString;
    let formDataObject;
    if(!url.toString().includes('/api/admin/delete')){
        formDataObject = Object.fromEntries(formData.entries());
        let value =getSelectValues(e);
        formDataObject.roles = roleList.filter(function (item) {
                return value.includes((item.id).toString());

        });
        formDataObject.age = Number(formDataObject.age);
        formDataJsonString = JSON.stringify(formDataObject);
    }
    let fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Accept: "application/json",
        },
        body: formDataJsonString,
    };
    let res = await fetch(url, fetchOptions);

    if(url.toString().includes('/api/admin/edit')){
        editRow.cells[1].textContent = formDataObject.name;
        editRow.cells[2].textContent = formDataObject.lastname;
        editRow.cells[3].textContent = formDataObject.age;
        editRow.cells[4].textContent = formDataObject.email;
        editRow.cells[5].textContent = formDataObject.password;
        editRow.cells[7].textContent = formDataObject.roles[0].name;
    }
    if (!res.ok) {
        let error = await res.text();
        throw new Error(error);
    }
    if(!url.toString().includes('/api/admin/delete')){
        return res.json();
    } else {
        return 1;
    }
}

async function getUsersList() {
    await fetch('api/admin/users')
        .then(response => response.json())
        .then(result => {
            return usersList = result;
        });

    return usersList;
}

async function getRoles() {
    await fetch('api/admin/roles')
        .then(response => response.json())
        .then(result => {
            roleList = result;
        });

}