(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _forms = require('./forms.js');

var _forms2 = _interopRequireDefault(_forms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    login: function login(g_actions) {
        return function (state, actions) {
            actions.updateLoading(true);
            var data = {
                username: state.forms.login.username,
                password: state.forms.login.password
            };
            fetch(g_urls.login, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(function (r) {
                return r.json();
            }).then(function (j) {
                if (j.key) {
                    console.log("OK", j.key, state.forms.login.username);
                    actions.updateLogin({ key: j.key, username: state.forms.login.username });
                    g_actions.location.go("/");
                    g_actions.toasts.add({ text: "Successfully logged in!", style: "success" });
                } else {
                    g_actions.toasts.add({ text: "Error while logging in - please try again!", style: "error" });
                }
                actions.updateLoading(false);
            });
        };
    },
    logout: function logout(g_actions) {
        return function (state, actions) {
            actions.updateLoading(true);
            setTimeout(function () {
                return fetch(g_urls.logout, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(function (r) {
                    return r.json();
                }).then(function (j) {
                    actions.updateLogin({ key: null, username: null });
                    g_actions.location.go("/");
                    actions.updateLoading(false);
                    g_actions.toasts.add({ text: "Successfully logged out!", style: "success" });
                });
            }, 500);
        };
    },
    updateLoading: function updateLoading(loading) {
        return function (state) {
            return {
                loading: loading
            };
        };
    },
    updateLogin: function updateLogin(_ref) {
        var key = _ref.key,
            username = _ref.username;
        return function (state) {
            localStorage.setItem("auth", JSON.stringify({ key: key, username: username }));
            return {
                key: key,
                username: username,
                forms: {
                    login: {}
                }
            };
        };
    },
    updateField: _forms2.default
};

},{"./forms.js":2}],2:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = {

    updateField: function updateField(_ref) {
        var formname = _ref.formname,
            fieldname = _ref.fieldname,
            value = _ref.value;
        return function (state) {
            console.log("Update ", formname, fieldname, value);
            return {
                forms: Object.assign({}, state.forms, _defineProperty({}, formname, Object.assign({}, state.forms[formname], _defineProperty({}, fieldname, value))))
            };
        };
    },

    addErrors: function addErrors(_ref2) {
        var formname = _ref2.formname,
            errors = _ref2.errors;
        return function (state) {
            console.log("Add errors ", errors);
            return {
                forms: Object.assign({}, state.forms, _defineProperty({}, formname, Object.assign({}, state.forms[formname], {
                    errors: errors
                })))
            };
        };
    }

};

},{}],3:[function(require,module,exports){
"use strict";

var _router = require("@hyperapp/router");

var _auth = require("./auth.js");

var _auth2 = _interopRequireDefault(_auth);

var _toasts = require("./toasts.js");

var _toasts2 = _interopRequireDefault(_toasts);

var _people = require("./people.js");

var _people2 = _interopRequireDefault(_people);

var _movies = require("./movies.js");

var _movies2 = _interopRequireDefault(_movies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducers = module.exports = {
    location: _router.location.actions,
    auth: _auth2.default,
    movies: _movies2.default,
    people: _people2.default,
    toasts: _toasts2.default

};

},{"./auth.js":1,"./movies.js":4,"./people.js":5,"./toasts.js":6,"@hyperapp/router":23}],4:[function(require,module,exports){
"use strict";

var _forms = require("./forms.js");

module.exports = {
    load: function load(url) {
        return function (state, actions) {
            actions.updateLoading(true);
            setTimeout(function () {
                return fetch(url).then(function (r) {
                    return r.json();
                }).then(function (j) {
                    var match = url.match(/\?page=(\d+)/);
                    var page = 1;
                    if (match) page = 1 * match[1];

                    actions.update({ response: j, current: url, page: page });
                    actions.updateLoading(false);
                });
            }, 100);
        };
    },

    updateLoading: function updateLoading(loading) {
        return function (state) {
            return {
                loading: loading
            };
        };
    },

    updateShowPlot: function updateShowPlot(showPlot) {
        return function (state) {
            return {
                showPlot: showPlot
            };
        };
    },

    update: function update(_ref) {
        var response = _ref.response,
            current = _ref.current,
            page = _ref.page;
        return function (state) {
            return {
                page: page,
                current: current,
                count: response.count,
                next: response.next,
                previous: response.previous,
                items: response.results

            };
        };
    },

    updateEdit: function updateEdit(item) {
        return function (state) {
            return {
                forms: Object.assign({}, state['forms'], {
                    edit: item
                })
            };
        };
    },

    saveEdit: function saveEdit(_ref2) {
        var key = _ref2.key,
            g_actions = _ref2.g_actions;
        return function (state, actions) {
            console.log("Saving ...", state);
            actions.updateLoading(true);
            var item = state.forms.edit;
            var saveUrl = '';
            var method = '';
            if (item.id) {
                // UPDATE
                console.log("Update item");
                saveUrl = item.url;
                method = 'PATCH';
            } else {
                // CREATE
                console.log("Create new item");
                saveUrl = window.g_urls.movies;
                method = 'POST';
            }

            window.setTimeout(function () {
                fetch(saveUrl, {
                    body: JSON.stringify(item),
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': "Token " + key
                    },
                    method: method
                }).then(function (response) {
                    actions.updateLoading(false);

                    if (response.status == 400) {
                        response.json().then(function (errors) {
                            console.log(errors);
                            actions.addErrors({ formname: 'edit', errors: errors });
                        });
                    } else if (response.status == 200 || response.status == 201) {
                        response.json().then(function (data) {
                            // Data is the object that was saved
                            console.log(data);
                            g_actions.toasts.add({ text: "Successfully saved object!", style: "success" });
                            actions.updateEdit(null);
                            actions.load(state.current);
                        });
                    }
                }).catch(function (error) {
                    console.log("ERR", error.status);
                });
            }, 500);
        };
    },
    searchAction: function searchAction(reset) {
        return function (state, actions) {
            console.log("SEARCH", reset, state);
            if (reset) {}
        };
    },
    updateField: _forms.updateField,
    addErrors: _forms.addErrors
};

},{"./forms.js":2}],5:[function(require,module,exports){
"use strict";

module.exports = {
    load: function load(url) {
        return function (state, actions) {
            actions.updateLoading(true);

            setTimeout(function () {
                return fetch(url).then(function (r) {
                    return r.json();
                }).then(function (j) {
                    var match = url.match(/\?page=(\d+)/);
                    var page = 1;
                    if (match) page = 1 * match[1];

                    actions.update({ response: j, page: page });
                    actions.updateLoading(false);
                });
            }, 100);
        };
    },

    updateLoading: function updateLoading(loading) {
        return function (state) {
            return {
                loading: loading
            };
        };
    },

    update: function update(_ref) {
        var response = _ref.response,
            page = _ref.page;
        return function (state) {
            return {
                page: page,
                count: response.count,
                next: response.next,
                previous: response.previous,
                items: response.results
            };
        };
    },

    edit: function edit(person) {
        return function (state) {
            return {
                editing: person
            };
        };
    }
};

},{}],6:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = {
    add: function add(_ref) {
        var text = _ref.text,
            style = _ref.style;
        return function (state) {
            return {
                items: [].concat(_toConsumableArray(state.items), [{ text: text, style: style }])
            };
        };
    },

    hide: function hide(text) {
        return function (state) {
            var idx = state.items.map(function (v) {
                return v.text;
            }).indexOf(text);
            return {
                items: [].concat(_toConsumableArray(state.items.slice(0, idx)), _toConsumableArray(state.items.slice(idx + 1)))
            };
        };
    },
    clear: function clear() {
        return function (state) {
            return {
                items: []
            };
        };
    }
};

},{}],7:[function(require,module,exports){
"use strict";

var _require = require('hyperapp'),
    h = _require.h;

var dateInput = function dateInput(element) {
    console.log(element);
    console.log(flatpickr);
    flatpickr(element, {
        onChange: function onChange(selectedDates, dateStr, instance) {
            console.log("CHANGED", selectedDates, dateStr, instance);
        }
    });
};

var FormDateInput = module.exports = function (_ref) {
    var label = _ref.label,
        value = _ref.value,
        action = _ref.action;
    return h(
        "div",
        { "class": "form-group" },
        h(
            "label",
            { "class": "form-label", "for": "{label}" },
            label
        ),
        h("input", { "class": "form-input", type: "text", id: "{label}",
            placeholder: label, value: value,
            onkeyup: function onkeyup(e) {
                return action(e.target.value);
            },
            oncreate: dateInput
        })
    );
};

},{"hyperapp":24}],8:[function(require,module,exports){
'use strict';

var _require = require('hyperapp'),
    h = _require.h;

var FormInput = function FormInput(_ref) {
    var field = _ref.field,
        action = _ref.action;
    return h(
        'div',
        { 'class': 'form-group ' + (field.errors ? 'has-error' : ''), key: field.key },
        h(
            'label',
            { 'class': 'form-label', 'for': '{field.key}' },
            field.label
        ),
        h('input', { 'class': 'form-input', type: field.type, id: field.key,
            placeholder: field.label, value: field.value,
            oninput: function oninput(e) {
                return action(e.target.value);
            }
        }),
        h(
            'div',
            { 'class': 'form-input-hint' },
            field.errors ? field.errors[0] : null
        )
    );
};

var FormInputLong = function FormInputLong(_ref2) {
    var field = _ref2.field,
        action = _ref2.action;
    return h(
        'div',
        { 'class': 'form-group' },
        h(
            'label',
            { 'class': 'form-label', 'for': '{field.key}' },
            field.label
        ),
        h('textarea', { 'class': 'form-input', id: field.key, rows: '5',
            placeholder: field.label,
            oninput: function oninput(e) {
                return action(e.target.value);
            },
            value: field.value })
    );
};

module.exports['FormInput'] = FormInput;
module.exports['FormInputLong'] = FormInputLong;

},{"hyperapp":24}],9:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var AbstractInput = function AbstractInput(_ref) {
    var field = _ref.field,
        action = _ref.action,
        realInput = _ref.realInput;
    return (0, _hyperapp.h)(
        'div',
        { 'class': 'form-group ' + (field.errors ? 'has-error' : ''), key: field.key },
        (0, _hyperapp.h)(
            'label',
            { 'class': 'form-label', 'for': '{field.key}' },
            field.label
        ),
        realInput,
        (0, _hyperapp.h)(
            'div',
            { 'class': 'form-input-hint' },
            field.errors ? field.errors[0] : null
        )
    );
};

var FormInput = function FormInput(_ref2) {
    var field = _ref2.field,
        action = _ref2.action;
    return AbstractInput({
        field: field,
        action: action,
        realInput: (0, _hyperapp.h)('input', { 'class': 'form-input', type: field.type, id: field.key,
            placeholder: field.label, value: field.value,
            oninput: function oninput(e) {
                return action(e.target.value);
            }
        })
    });
};

var FormInputLong = function FormInputLong(_ref3) {
    var field = _ref3.field,
        action = _ref3.action;
    return AbstractInput({
        field: field,
        action: action,
        realInput: (0, _hyperapp.h)('textarea', { 'class': 'form-input', id: field.key, rows: '5',
            placeholder: field.label,
            oninput: function oninput(e) {
                return action(e.target.value);
            },
            value: field.value
        })

    });
};

module.exports['FormInput'] = FormInput;
module.exports['FormInputLong'] = FormInputLong;

},{"hyperapp":24}],10:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var _FormInputs = require('./FormInputs.js');

var _Spinners = require('../components/Spinners.js');

var renderField = function renderField(field, updateFieldAction) {
    var ftype = _FormInputs.FormInput;
    if (field.type == 'longtext') ftype = _FormInputs.FormInputLong;
    return ftype({
        field: field,
        action: function action(val) {
            return updateFieldAction(field.key, val);
        }
    });
};

var renderFields = function renderFields(fields, updateFieldAction) {
    return fields.map(function (f) {
        return renderField(f, updateFieldAction);
    });
};

var ModalForm = module.exports = function (_ref) {
    var loading = _ref.loading,
        formFields = _ref.formFields,
        item = _ref.item,
        hideAction = _ref.hideAction,
        saveAction = _ref.saveAction,
        updateFieldAction = _ref.updateFieldAction;
    return (0, _hyperapp.h)(
        'div',
        { className: 'modal ' + (item ? 'active' : '') },
        (0, _hyperapp.h)('div', { 'class': 'modal-overlay' }),
        (0, _hyperapp.h)(
            'div',
            { 'class': 'modal-container' },
            (0, _hyperapp.h)(
                'div',
                { 'class': 'modal-header' },
                (0, _hyperapp.h)('button', { 'class': 'btn btn-clear float-right', onclick: hideAction }),
                (0, _hyperapp.h)(
                    'div',
                    { 'class': 'modal-title h5' },
                    item.id ? 'Editing item ' + item.id : "Add new item!"
                )
            ),
            (0, _hyperapp.h)(
                'div',
                { 'class': 'modal-body' },
                (0, _hyperapp.h)(
                    'div',
                    { 'class': 'content' },
                    (0, _hyperapp.h)(
                        'form',
                        { method: 'POST' },
                        renderFields(formFields, updateFieldAction)
                    )
                )
            ),
            (0, _hyperapp.h)(
                'div',
                { 'class': 'modal-footer' },
                loading ? (0, _hyperapp.h)(_Spinners.SpinnerSmall, null) : (0, _hyperapp.h)(
                    'div',
                    null,
                    (0, _hyperapp.h)(
                        'button',
                        { 'class': 'btn', onclick: hideAction },
                        'Cancel'
                    ),
                    (0, _hyperapp.h)(
                        'button',
                        { 'class': 'ml-2 btn btn-primary', onclick: saveAction },
                        'Ok'
                    )
                )
            )
        )
    );
};

},{"../components/Spinners.js":18,"./FormInputs.js":9,"hyperapp":24}],11:[function(require,module,exports){
'use strict';

var _require = require('hyperapp'),
    h = _require.h;

var Pagination = module.exports = function (_ref) {
    var page = _ref.page,
        next = _ref.next,
        previous = _ref.previous,
        loadAction = _ref.loadAction;
    return h(
        'ul',
        { 'class': 'pagination' },
        h(
            'li',
            { 'class': 'page-item ' + (previous ? '' : 'disabled') },
            h(
                'a',
                { onclick: function onclick() {
                        return loadAction(previous);
                    }, href: '#', tabindex: '-1' },
                'Previous'
            )
        ),
        h(
            'li',
            { 'class': 'page-item' },
            h(
                'a',
                { href: '#' },
                page
            )
        ),
        h(
            'li',
            { 'class': 'page-item ' + (next ? '' : 'disabled') },
            h(
                'a',
                { onclick: function onclick() {
                        return loadAction(next);
                    }, href: '#' },
                'Next'
            )
        )
    );
};

},{"hyperapp":24}],12:[function(require,module,exports){
'use strict';

var _FormInput = require('./FormInput.js');

var _FormInput2 = _interopRequireDefault(_FormInput);

var _FormDateInput = require('./FormDateInput.js');

var _FormDateInput2 = _interopRequireDefault(_FormDateInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('hyperapp'),
    h = _require.h;

var PersonForm = module.exports = function (_ref) {
    var person = _ref.person,
        actions = _ref.actions;

    return h(
        'form',
        null,
        h(_FormInput2.default, { label: 'Όνομα', value: person.name, action: function action(x) {
                return actions.updateForm({ object: 'person', field: 'name', value: x });
            } }),
        h(_FormInput2.default, { label: 'Φύλο', value: person.gender, action: function action(x) {
                return actions.updateForm({ object: 'person', field: 'gender', value: x });
            } }),
        h(_FormInput2.default, { label: 'Έτος γέννησης', value: person.birth_year, action: function action(x) {
                return actions.updateForm({ object: 'person', field: 'birth_year', value: x });
            } }),
        h(_FormDateInput2.default, { label: 'Έτος γέννησης', value: person.created, action: function action(x) {
                return actions.updateForm({ object: 'person', field: 'birth_year', value: x });
            } }),
        h(
            'td',
            null,
            h(
                'button',
                { type: 'button', 'class': 'btn btn-block', onclick: function onclick() {
                        //console.log(person.url)
                        var id = person.url.match(/\/(\d+)\/$/)[1];
                        //console.log(id)
                        actions.savePerson(id);
                    }
                },
                'Save'
            )
        ),
        h(
            'td',
            null,
            h(
                'button',
                { type: 'button', 'class': 'btn btn-block btn-primary', onclick: function onclick() {
                        return actions.hideModal();
                    } },
                'Cancel'
            )
        )
    );
};

},{"./FormDateInput.js":7,"./FormInput.js":8,"hyperapp":24}],13:[function(require,module,exports){
'use strict';

var _SpinnerSmall = require('./SpinnerSmall.js');

var _SpinnerSmall2 = _interopRequireDefault(_SpinnerSmall);

var _PersonForm = require('./PersonForm.js');

var _PersonForm2 = _interopRequireDefault(_PersonForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('hyperapp'),
    h = _require.h;

var PersonModal = module.exports = function (_ref) {
    var person = _ref.person,
        loading = _ref.loading,
        actions = _ref.actions;

    var personDisplay = '';
    console.log(person);
    if (person && person.name) {
        personDisplay = h(_PersonForm2.default, { person: person, actions: actions });
    } else {
        personDisplay = '';
    }
    return h(
        'div',
        { className: 'modal ' + (person ? 'active' : '') },
        h('div', { 'class': 'modal-overlay' }),
        h(
            'div',
            { 'class': 'modal-container' },
            h(
                'div',
                { 'class': 'modal-header' },
                h('button', { 'class': 'btn btn-clear float-right', onclick: function onclick() {
                        return actions.hideModal();
                    } }),
                h(
                    'div',
                    { 'class': 'modal-title h5' },
                    '\u03A3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1 \u03C0\u03C1\u03BF\u03C3\u03CE\u03C0\u03BF\u03C5 ',
                    person && person.name ? person.name : ''
                )
            ),
            h(
                'div',
                { 'class': 'modal-body' },
                h(
                    'div',
                    { 'class': 'content' },
                    loading ? h(_SpinnerSmall2.default, null) : personDisplay
                )
            ),
            h(
                'div',
                { 'class': 'modal-footer' },
                'ddd'
            )
        )
    );
};

},{"./PersonForm.js":12,"./SpinnerSmall.js":17,"hyperapp":24}],14:[function(require,module,exports){
'use strict';

var _require = require('hyperapp'),
    h = _require.h;

var PlotModal = module.exports = function (_ref) {
    var movie = _ref.movie,
        actions = _ref.actions;
    return h(
        'div',
        { className: 'modal ' + (movie ? 'active' : '') },
        h('div', { 'class': 'modal-overlay' }),
        h(
            'div',
            { 'class': 'modal-container' },
            h(
                'div',
                { 'class': 'modal-header' },
                h('button', { 'class': 'btn btn-clear float-right', onclick: function onclick() {
                        return actions.updateShowPlot(null);
                    } }),
                h(
                    'div',
                    { 'class': 'modal-title h5' },
                    movie.title
                )
            ),
            h(
                'div',
                { 'class': 'modal-body' },
                h(
                    'div',
                    { 'class': 'content' },
                    movie.story
                )
            ),
            h(
                'div',
                { 'class': 'modal-footer' },
                h(
                    'button',
                    { 'class': 'btn', onclick: function onclick() {
                            return actions.updateShowPlot(null);
                        } },
                    'Ok'
                )
            )
        )
    );
};

},{"hyperapp":24}],15:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var _Spinners = require('../components/Spinners.js');

var renderField = function renderField(field, updateFieldAction) {
    var ftype = FormInput;
    if (field.type == 'longtext') ftype = FormInputLong;
    return ftype({
        field: field,
        action: function action(val) {
            return updateFieldAction(field.key, val);
        }
    });
};

var renderFields = function renderFields(fields, updateFieldAction) {
    return fields.map(function (f) {
        return renderField(f, updateFieldAction);
    });
};

var SearchForm = module.exports = function (_ref) {
    var loading = _ref.loading,
        formFields = _ref.formFields,
        searchAction = _ref.searchAction,
        updateFieldAction = _ref.updateFieldAction;
    return (0, _hyperapp.h)(
        'form',
        { method: 'GET', 'class': 'form-horizontal' },
        (0, _hyperapp.h)(
            'div',
            { 'class': 'form-group' },
            formFields.map(function (f) {
                return (0, _hyperapp.h)(
                    'div',
                    { key: f.key },
                    (0, _hyperapp.h)(
                        'label',
                        { 'class': 'form-label', 'for': f.key },
                        f.label
                    ),
                    (0, _hyperapp.h)('input', { 'class': 'form-input', type: f.type, id: f.key, placeholder: f.label, value: f.value,
                        oninput: function oninput(e) {
                            return updateFieldAction(f.key, e.target.value);
                        }
                    })
                );
            }),
            loading ? (0, _hyperapp.h)(_Spinners.SpinnerSmall, null) : (0, _hyperapp.h)(
                'div',
                null,
                (0, _hyperapp.h)(
                    'button',
                    { style: { 'margin-top': '2.3em' }, 'class': 'btn ml-2', onclick: function onclick(e) {
                            e.preventDefault();searchAction(true);return false;
                        } },
                    'Reset'
                ),
                (0, _hyperapp.h)(
                    'button',
                    { style: { marginTop: '2.3em' }, 'class': 'btn ml-2 btn-primary', onclick: function onclick(e) {
                            e.preventDefault();searchAction();return false;
                        } },
                    'Filter'
                )
            )
        )
    );
};

},{"../components/Spinners.js":18,"hyperapp":24}],16:[function(require,module,exports){
"use strict";

var _hyperapp = require("hyperapp");

var Spinner = function Spinner() {
    return (0, _hyperapp.h)(
        "div",
        { "class": "spinner" },
        (0, _hyperapp.h)("div", { "class": "bounce1" }),
        (0, _hyperapp.h)("div", { "class": "bounce2" }),
        (0, _hyperapp.h)("div", { "class": "bounce3" })
    );
};

var SpinnerSmall = module.exports = function () {
    return (0, _hyperapp.h)("div", { "class": "loading loading-lg" });
};

module.exports['Spinner'] = Spinner;
module.exports['SpinnerSmall'] = SpinnerSmall;

},{"hyperapp":24}],17:[function(require,module,exports){
'use strict';

var _require = require('hyperapp'),
    h = _require.h;

// OR

},{"hyperapp":24}],18:[function(require,module,exports){
"use strict";

var _hyperapp = require("hyperapp");

var Spinner = function Spinner() {
    return (0, _hyperapp.h)(
        "div",
        { "class": "spinner" },
        (0, _hyperapp.h)("div", { "class": "bounce1" }),
        (0, _hyperapp.h)("div", { "class": "bounce2" }),
        (0, _hyperapp.h)("div", { "class": "bounce3" })
    );
};

var SpinnerSmall = module.exports = function () {
    return (0, _hyperapp.h)("div", { "class": "loading loading-lg" });
};

module.exports['Spinner'] = Spinner;
module.exports['SpinnerSmall'] = SpinnerSmall;

},{"hyperapp":24}],19:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var _Pagination = require('../components/Pagination.js');

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Row = module.exports = function (_ref) {
    var row = _ref.row,
        rowColumns = _ref.rowColumns,
        actions = _ref.actions;
    return (0, _hyperapp.h)(
        'tr',
        null,
        rowColumns.map(function (z) {
            return (0, _hyperapp.h)(
                'td',
                null,
                z(row, actions)
            );
        })
    );
};

var Table = module.exports = function (_ref2) {
    var rowHeaders = _ref2.rowHeaders,
        rowColumns = _ref2.rowColumns,
        rows = _ref2.rows,
        actions = _ref2.actions;
    return (0, _hyperapp.h)(
        'div',
        null,
        (0, _hyperapp.h)(
            'table',
            { 'class': 'table table-striped table-hover' },
            (0, _hyperapp.h)(
                'thead',
                null,
                (0, _hyperapp.h)(
                    'tr',
                    null,
                    rowHeaders.map(function (z) {
                        return (0, _hyperapp.h)(
                            'th',
                            null,
                            z
                        );
                    })
                )
            ),
            (0, _hyperapp.h)(
                'tbody',
                null,
                rows.items.map(function (z) {
                    return (0, _hyperapp.h)(Row, { row: z, rowColumns: rowColumns, actions: actions });
                })
            )
        ),
        (0, _hyperapp.h)(_Pagination2.default, { page: rows.page, next: rows.next, previous: rows.previous, loadAction: actions.load })
    );
};

},{"../components/Pagination.js":11,"hyperapp":24}],20:[function(require,module,exports){
"use strict";

var _hyperapp = require("hyperapp");

var _router = require("@hyperapp/router");

var Table = module.exports = function (_ref) {
  var currentLocation = _ref.currentLocation,
      auth = _ref.auth,
      actions = _ref.actions;
  return (0, _hyperapp.h)(
    "ul",
    { "class": "tab tab-block" },
    (0, _hyperapp.h)(
      "li",
      { className: "tab-item " + (currentLocation.pathname == '/' || !currentLocation.pathname ? 'active' : '') },
      (0, _hyperapp.h)(
        _router.Link,
        { to: "/" },
        "Home"
      )
    ),
    (0, _hyperapp.h)(
      "li",
      { className: "tab-item " + (currentLocation.pathname == '/movies' ? 'active' : '') },
      (0, _hyperapp.h)(
        _router.Link,
        { to: "/movies" },
        "Movies"
      )
    ),
    (0, _hyperapp.h)(
      "li",
      { className: "tab-item " + (currentLocation.pathname == '/people' ? 'active' : '') },
      (0, _hyperapp.h)(
        _router.Link,
        { to: "/people" },
        "People"
      )
    ),
    auth.key ? (0, _hyperapp.h)(
      "div",
      null,
      auth.username,
      " ",
      (0, _hyperapp.h)(
        "button",
        { "class": "btn", onclick: function onclick() {
            return actions.auth.logout(actions);
          } },
        "Logout"
      )
    ) : (0, _hyperapp.h)(
      "li",
      { className: "tab-item " + (currentLocation.pathname == '/login' ? 'active' : '') },
      (0, _hyperapp.h)(
        _router.Link,
        { to: "/login" },
        "Login"
      )
    )
  );
};

},{"@hyperapp/router":23,"hyperapp":24}],21:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var Toast = function Toast(_ref) {
    var text = _ref.text,
        actions = _ref.actions,
        _ref$style = _ref.style,
        style = _ref$style === undefined ? 'primary' : _ref$style;
    return (0, _hyperapp.h)(
        'div',
        { className: 'toast toast-' + style },
        (0, _hyperapp.h)('button', { 'class': 'btn btn-clear float-right', onclick: function onclick() {
                return actions.toasts.hide(text);
            } }),
        text
    );
};

var ToastContainer = module.exports = function (_ref2) {
    var toasts = _ref2.toasts,
        actions = _ref2.actions;
    return (0, _hyperapp.h)(
        'div',
        { className: 'toast-container' },
        toasts.items.map(function (t) {
            return (0, _hyperapp.h)(Toast, { text: t.text, style: t.style, actions: actions });
        })
    );
};

},{"hyperapp":24}],22:[function(require,module,exports){
"use strict";

var _hyperapp = require("hyperapp");

var _router = require("@hyperapp/router");

var _actions = require("./actions");

var _actions2 = _interopRequireDefault(_actions);

var _Main = require("./views/Main.js");

var _Main2 = _interopRequireDefault(_Main);

var _state = require("./state.js");

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var application = (0, _hyperapp.app)(_state2.default, _actions2.default, _Main2.default, document.getElementById("app"));

var unsubscribe = _router.location.subscribe(application.location);

var hideToasts = function hideToasts() {
    application.toasts.clear();
};

_actions2.default.location.go('/');

addEventListener("pushstate", hideToasts);
addEventListener("popstate", hideToasts);

},{"./actions":3,"./state.js":25,"./views/Main.js":28,"@hyperapp/router":23,"hyperapp":24}],23:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("hyperapp")):"function"==typeof define&&define.amd||e(t.router={},t.hyperapp)}(this,function(t,e){"use strict";function n(t,e,n,o){return{isExact:t,path:e,url:n,params:o}}function o(t){for(var e=t.length;"/"===t[--e];);return t.slice(0,e+1)}var i={state:{pathname:window.location.pathname,previous:window.location.pathname},actions:{go:function(t){history.pushState(null,"",t)},set:function(t){return t}},subscribe:function(t){function e(e){t.set({pathname:window.location.pathname,previous:e.detail?window.location.previous=e.detail:window.location.previous})}var n=function(t){return t.reduce(function(t,e){var n=history[e];return history[e]=function(t,e,o){n.call(this,t,e,o),dispatchEvent(new CustomEvent("pushstate",{detail:t}))},function(){history[e]=n,t&&t()}},null)}(["pushState","replaceState"]);return addEventListener("pushstate",e),addEventListener("popstate",e),function(){removeEventListener("pushstate",e),removeEventListener("popstate",e),n()}}};t.Link=function(t,n){var o=t.to,i=t.location||window.location;return t.href=o,t.onclick=function(e){0!==e.button||e.altKey||e.metaKey||e.ctrlKey||e.shiftKey||"_blank"===t.target||e.currentTarget.origin!==i.origin||(e.preventDefault(),o!==i.pathname&&history.pushState(i.pathname,"",o))},e.h("a",t,n)},t.Route=function(t){var e=t.location||window.location,i=function(t,e,i){if(t===e||!t)return n(t===e,t,e);var a=i&&i.exact,r=o(t).split("/"),c=o(e).split("/");if(!(r.length>c.length||a&&r.length<c.length)){var u=0,s={},p=r.length;for(e="";u<p;u++){if(":"===r[u][0])try{s[r[u].slice(1)]=c[u]=decodeURI(c[u])}catch(t){continue}else if(r[u]!==c[u])return;e+=c[u]+"/"}return n(!1,t,e.slice(0,-1),s)}}(t.path,e.pathname,{exact:!t.parent});return i&&t.render({match:i,location:e})},t.Switch=function(t,e){return e[0]},t.Redirect=function(t){var e=t.location||window.location;history.replaceState(t.from||e.pathname,"",t.to)},t.location=i});

},{"hyperapp":24}],24:[function(require,module,exports){
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd||n(e.hyperapp={})}(this,function(e){"use strict";e.h=function(e,n){for(var t,r=[],o=[],i=arguments.length;i-- >2;)r.push(arguments[i]);for(;r.length;)if((t=r.pop())&&t.pop)for(i=t.length;i--;)r.push(t[i]);else null!=t&&!0!==t&&!1!==t&&o.push(t);return"function"==typeof e?e(n||{},o):{nodeName:e,attributes:n||{},children:o,key:n&&n.key}},e.app=function(e,n,t,r){var o,i=[],u=r&&r.children[0]||null,l=u&&function e(n,t){return{nodeName:n.nodeName.toLowerCase(),attributes:{},children:t.call(n.childNodes,function(n){return 3===n.nodeType?n.nodeValue:e(n,t)})}}(u,[].map),f=s(e),a=s(n);return d(function e(n,t,r){for(var o in r)"function"==typeof r[o]?function(e,o){r[e]=function(e){return"function"==typeof(e=o(e))&&(e=e(p(n,f),r)),e&&e!==(t=p(n,f))&&!e.then&&d(f=h(n,s(t,e),f)),e}}(o,r[o]):e(n.concat(o),t[o]=t[o]||{},r[o]=s(r[o]))}([],f,a)),a;function c(){o=!o;var e=t(f,a);for(r&&!o&&(u=function e(n,t,r,o,u,l){if(o===r);else if(null==r)t=n.insertBefore(y(o,u),t);else if(o.nodeName&&o.nodeName===r.nodeName){!function(e,n,t,r){for(var o in s(n,t))t[o]!==("value"===o||"checked"===o?e[o]:n[o])&&m(e,o,t[o],r,n[o]);t.onupdate&&i.push(function(){t.onupdate(e,n)})}(t,r.attributes,o.attributes,u=u||"svg"===o.nodeName);for(var f=[],a={},c={},d=0;d<r.children.length;d++){f[d]=t.childNodes[d];var h=r.children[d],p=v(h);null!=p&&(a[p]=[f[d],h])}for(var d=0,b=0;b<o.children.length;){var h=r.children[d],g=o.children[b],p=v(h),k=v(g);if(c[p])d++;else if(null==k)null==p&&(e(t,f[d],h,g,u),b++),d++;else{var w=a[k]||[];p===k?(e(t,w[0],w[1],g,u),d++):w[0]?e(t,t.insertBefore(w[0],f[d]),w[1],g,u):e(t,f[d],null,g,u),b++,c[k]=g}}for(;d<r.children.length;){var h=r.children[d];null==v(h)&&N(t,f[d],h),d++}for(var d in a)c[a[d][1].key]||N(t,a[d][0],a[d][1])}else o.nodeName===r.nodeName?t.nodeValue=o:(t=n.insertBefore(y(o,u),l=t),N(n,l,r));return t}(r,u,l,l=e));e=i.pop();)e()}function d(){o||(o=!o,setTimeout(c))}function s(e,n){var t={};for(var r in e)t[r]=e[r];for(var r in n)t[r]=n[r];return t}function h(e,n,t){var r={};return e.length?(r[e[0]]=e.length>1?h(e.slice(1),n,t[e[0]]):n,s(t,r)):n}function p(e,n){for(var t=0;t<e.length;t++)n=n[e[t]];return n}function v(e){return e?e.key:null}function m(e,n,t,r,o){if("key"===n);else if("style"===n)for(var i in s(o,t))e[n][i]=null==t||null==t[i]?"":t[i];else"function"==typeof t||n in e&&!r?e[n]=null==t?"":t:null!=t&&!1!==t&&e.setAttribute(n,t),null!=t&&!1!==t||e.removeAttribute(n)}function y(e,n){var t="string"==typeof e||"number"==typeof e?document.createTextNode(e):(n=n||"svg"===e.nodeName)?document.createElementNS("http://www.w3.org/2000/svg",e.nodeName):document.createElement(e.nodeName);if(e.attributes){e.attributes.oncreate&&i.push(function(){e.attributes.oncreate(t)});for(var r=0;r<e.children.length;r++)t.appendChild(y(e.children[r],n));for(var o in e.attributes)m(t,o,e.attributes[o],n)}return t}function N(e,n,t,r){function o(){e.removeChild(function e(n,t,r){if(r=t.attributes){for(var o=0;o<t.children.length;o++)e(n.childNodes[o],t.children[o]);r.ondestroy&&r.ondestroy(n)}return n}(n,t))}t.attributes&&(r=t.attributes.onremove)?r(n,o):o()}}});

},{}],25:[function(require,module,exports){
'use strict';

var existingAuth = localStorage.getItem("auth");

if (existingAuth) {
    try {
        existingAuth = JSON.parse(existingAuth);
    } catch (error) {
        existingAuth = null;
    }
}
if (!existingAuth) existingAuth = { key: '', username: '' };

var state = module.exports = {
    auth: {
        key: existingAuth.key,
        username: existingAuth.username,
        loading: false,
        forms: {
            login: {}
        }
    },
    location: location.state,
    toasts: {
        items: []
    },
    movies: {
        showPlot: false,
        loading: false,
        page: null,
        count: 0,
        next: null,
        previous: null,
        current: null,
        items: [],
        forms: {
            edit: null,
            search: {}
        }
    },
    people: {
        loading: false,
        page: null,
        count: 0,
        next: null,
        previous: null,
        items: [],
        editing: null
    }
};

},{}],26:[function(require,module,exports){
"use strict";

var _hyperapp = require("hyperapp");

var Home = module.exports = function (state, actions) {
    return (0, _hyperapp.h)(
        "div",
        { key: "home" },
        state.auth.key ? (0, _hyperapp.h)(
            "span",
            null,
            "Hello, ",
            state.auth.username,
            "!"
        ) : (0, _hyperapp.h)(
            "span",
            null,
            "Please login to edit things"
        )
    );
};

},{"hyperapp":24}],27:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var _FormInput = require('../components/FormInput.js');

var _FormInput2 = _interopRequireDefault(_FormInput);

var _Spinner = require('../components/Spinner.js');

var _Spinner2 = _interopRequireDefault(_Spinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var okClick = function okClick(e, actions, g_actions) {
    actions.login(g_actions);
    return false;
};

var Login = module.exports = function (state, actions, g_actions) {
    return (0, _hyperapp.h)(
        'div',
        { key: 'login' },
        (0, _hyperapp.h)(
            'h2',
            null,
            'Login'
        ),
        (0, _hyperapp.h)(
            'form',
            { method: 'POST' },
            (0, _hyperapp.h)(_FormInput2.default, { label: 'Username', value: state.forms.login.username, action: function action(value) {
                    return actions.updateField({ formname: 'login', fieldname: 'username', value: value });
                } }),
            (0, _hyperapp.h)(_FormInput2.default, { label: 'Password', value: state.forms.login.password, type: 'password', action: function action(value) {
                    return actions.updateField({ formname: 'login', fieldname: 'password', value: value });
                } }),
            state.loading == true ? (0, _hyperapp.h)(_Spinner2.default, null) : (0, _hyperapp.h)(
                'button',
                { id: 'btn', name: 'btn', 'class': 'btn btn-primary', onclick: function onclick(e) {
                        return okClick(e, actions, g_actions);
                    } },
                'Ok'
            )
        )
    );
};

},{"../components/FormInput.js":8,"../components/Spinner.js":16,"hyperapp":24}],28:[function(require,module,exports){
"use strict";

var _hyperapp = require("hyperapp");

var _router = require("@hyperapp/router");

var _Home = require("./Home.js");

var _Home2 = _interopRequireDefault(_Home);

var _Movies = require("./Movies.js");

var _Movies2 = _interopRequireDefault(_Movies);

var _People = require("./People.js");

var _People2 = _interopRequireDefault(_People);

var _Login = require("./Login.js");

var _Login2 = _interopRequireDefault(_Login);

var _Tabs = require("../components/Tabs.js");

var _Tabs2 = _interopRequireDefault(_Tabs);

var _ToastContainer = require("../components/ToastContainer.js");

var _ToastContainer2 = _interopRequireDefault(_ToastContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducers = module.exports = function (state, actions) {
    return (0, _hyperapp.h)(
        "div",
        { "class": "container grid-xl" },
        (0, _hyperapp.h)(_Tabs2.default, { currentLocation: state.location, auth: state.auth, actions: actions }),
        (0, _hyperapp.h)(
            _router.Switch,
            null,
            (0, _hyperapp.h)(_router.Route, { path: "/", render: function render() {
                    return (0, _Home2.default)(state, actions);
                } }),
            (0, _hyperapp.h)(_router.Route, { path: "/movies", render: function render() {
                    return (0, _Movies2.default)(state, actions.movies, actions);
                } }),
            (0, _hyperapp.h)(_router.Route, { path: "/people", render: function render() {
                    return (0, _People2.default)(state.people, actions.people);
                } }),
            (0, _hyperapp.h)(_router.Route, { path: "/login", render: function render() {
                    return (0, _Login2.default)(state.auth, actions.auth, actions);
                } })
        ),
        (0, _hyperapp.h)(_ToastContainer2.default, { toasts: state.toasts, actions: actions }),
        JSON.stringify(state)
    );
};

},{"../components/Tabs.js":20,"../components/ToastContainer.js":21,"./Home.js":26,"./Login.js":27,"./Movies.js":29,"./People.js":30,"@hyperapp/router":23,"hyperapp":24}],29:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var _Spinners = require('../components/Spinners.js');

var _PlotModal = require('../components/PlotModal.js');

var _PlotModal2 = _interopRequireDefault(_PlotModal);

var _Table = require('../components/Table.js');

var _Table2 = _interopRequireDefault(_Table);

var _ModalForm = require('../components/ModalForm.js');

var _ModalForm2 = _interopRequireDefault(_ModalForm);

var _SearchForm = require('../components/SearchForm.js');

var _SearchForm2 = _interopRequireDefault(_SearchForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rowHeaders = ['Id', 'Title', 'Release year', 'Runtime', 'Genres', 'Plot', 'Edit'];

var rowColumns = [function (movie, actions) {
    return movie.id;
}, function (movie, actions) {
    return movie.title;
}, function (movie, actions) {
    return movie.release_year;
}, function (movie, actions) {
    return movie.runtime;
}, function (movie, actions) {
    return movie.genres.map(function (z) {
        return (0, _hyperapp.h)(
            'span',
            { 'class': 'chip bg-dark' },
            (0, _hyperapp.h)(
                'a',
                { 'class': 'text-secondary text-norma', href: '' },
                z.name
            )
        );
    });
}, function (movie, actions) {
    return (0, _hyperapp.h)(
        'span',
        { onclick: function onclick() {
                return actions.updateShowPlot(movie);
            } },
        movie.story.substring(0, 50) + '...'
    );
}, function (movie, actions) {
    return (0, _hyperapp.h)(
        'button',
        { 'class': 'btn btn-block btn-primary', onclick: function onclick() {
                return actions.updateEdit(Object.assign({}, movie));
            } },
        'Edit'
    );
}];

var checkAuth = function checkAuth(list, auth) {
    if (auth.key) return list;
    return list.slice(0, -1);
};

// TODO: Maybe this is better
var tableDef = [{
    'key': 'id',
    'label': 'Id',
    'render': function render(movie, actions) {
        return movie.id;
    } // etc
}];

var formFields = [{ 'key': 'title', 'label': 'Title', 'type': 'text' }, { 'key': 'release_year', 'label': 'Release Year', 'type': 'number' }, { 'key': 'runtime', 'label': 'Runtime', 'type': 'number' }, { 'key': 'story', 'label': 'Plot', 'type': 'longtext' }];

var mergeValuesErrors = function mergeValuesErrors(formFields, item, errors) {
    return formFields.map(function (f) {
        return Object.assign({}, f, {
            'value': item[f.key]
        }, errors ? {
            'errors': errors[f.key]
        } : {});
    });
};

var Movies = module.exports = function (state, actions, g_actions) {
    return (0, _hyperapp.h)(
        'div',
        { key: 'movies' },
        (0, _hyperapp.h)(
            'h2',
            null,
            'Movie list \xA0  \xA0',
            (0, _hyperapp.h)(
                'button',
                { 'class': 'btn btn-primary btn-action btn-lg', onclick: function onclick() {
                        return actions.updateEdit({});
                    } },
                (0, _hyperapp.h)('i', { 'class': 'icon icon-plus' })
            )
        ),
        (0, _hyperapp.h)(
            'div',
            { 'class': 'columns' },
            (0, _hyperapp.h)(
                'div',
                { 'class': 'column col-lg-12', oncreate: function oncreate() {
                        return actions.load(window.g_urls.movies);
                    } },
                (0, _hyperapp.h)(_SearchForm2.default, {
                    formFields: mergeValuesErrors(formFields, state.movies.forms.search, null),
                    updateFieldAction: function updateFieldAction(key, value) {
                        return actions.updateField({ formname: 'search', fieldname: key, value: value });
                    },
                    searchAction: actions.searchAction
                }),
                state.movies.loading == true ? (0, _hyperapp.h)(_Spinners.Spinner, null) : (0, _hyperapp.h)(_Table2.default, {
                    rowHeaders: checkAuth(rowHeaders, state.auth),
                    rowColumns: checkAuth(rowColumns, state.auth),
                    rows: state.movies,
                    actions: actions
                })
            )
        ),
        state.movies.showPlot ? (0, _hyperapp.h)(_PlotModal2.default, { movie: state.movies.showPlot, actions: actions }) : null,
        state.movies.forms.edit ? (0, _hyperapp.h)(_ModalForm2.default, {
            loading: state.movies.loading,
            formFields: mergeValuesErrors(formFields, state.movies.forms.edit, state.movies.forms.edit.errors),
            item: state.movies.forms.edit,
            hideAction: function hideAction() {
                return actions.updateEdit(null);
            },
            saveAction: function saveAction() {
                return actions.saveEdit({ g_actions: g_actions, key: state.auth.key });
            },
            updateFieldAction: function updateFieldAction(key, value) {
                return actions.updateField({ formname: 'edit', fieldname: key, value: value });
            }
        }) : null
    );
};

},{"../components/ModalForm.js":10,"../components/PlotModal.js":14,"../components/SearchForm.js":15,"../components/Spinners.js":18,"../components/Table.js":19,"hyperapp":24}],30:[function(require,module,exports){
'use strict';

var _hyperapp = require('hyperapp');

var _Spinners = require('../components/Spinners.js');

var _Table = require('../components/Table.js');

var _Table2 = _interopRequireDefault(_Table);

var _PersonModal = require('../components/PersonModal.js');

var _PersonModal2 = _interopRequireDefault(_PersonModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rowHeaders = ['Id', 'Name', 'Birthday', 'Edit'];

var rowColumns = [function (person, actions) {
    return person.id;
}, function (person, actions) {
    return person.name;
}, function (person, actions) {
    return person.birthday;
}, function (person, actions) {
    return (0, _hyperapp.h)(
        'button',
        { 'class': 'btn btn-block btn-primary', onclick: function onclick() {
                return actions.edit(person);
            } },
        'Edit'
    );
}];

var People = module.exports = function (state, actions) {
    return (0, _hyperapp.h)(
        'div',
        { key: 'people' },
        (0, _hyperapp.h)(
            'h2',
            null,
            'People list'
        ),
        (0, _hyperapp.h)(
            'div',
            { 'class': 'columns' },
            (0, _hyperapp.h)(
                'div',
                { 'class': 'column col-lg-12', oncreate: function oncreate() {
                        return actions.load(window.g_urls.persons);
                    } },
                state.loading == true ? (0, _hyperapp.h)(_Spinners.Spinner, null) : (0, _hyperapp.h)(_Table2.default, { rowHeaders: rowHeaders, rowColumns: rowColumns, rows: state, actions: actions })
            )
        )
    );
};

},{"../components/PersonModal.js":13,"../components/Spinners.js":18,"../components/Table.js":19,"hyperapp":24}]},{},[22]);
