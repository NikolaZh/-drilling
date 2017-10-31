'use strict';

class Model {

    static toIdFormat(s) {
        return s.replace(/\s+/g, '-');
    }

    constructor(fields = {}, id = null) {
        this._id = id;
        this._f = fields;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get fields() {
        return this._f;
    }

    toJSON() {
        const data = { id: this.id };
        for (let key of Object.keys(this._f)) {
            data[key] = this._f[key];
        }
        return data;
    }

}

class Driller extends Model {

    static get fields() {
        return { "name": "Название буровой", "code": "Серийный номер" };
    }

    static unwrap(fields) {
        return new Driller({ name: fields.name, code: fields.code }, fields.id);
    }

    constructor(fields = {}, id = null) {
        super(fields, id);
        if (!id && (fields.code !== undefined)) {
            this.id = Model.toIdFormat(fields.code);
        };

    }

    get name() {
        return this.fields.name;
    }

    get code() {
        return this.fields.code;
    }

}

class Equipment extends Model {

    static unwrap(fields) {
        return new Equipment({ type: fields.type, code: fields.code }, fields.id);
    }

    constructor(fields = {}, id = null) {
        super(fields, id);
        if (!id && (fields.code !== undefined)) {
            this.id = Model.toIdFormat(fields.code);
        };

    }

    get type() {
        return this.fields.type;
    }

    get code() {
        return this.fields.code;
    }

}




class Project extends Model {

    static unwrap(fields) {
        return new Project({ name: fields.name, address: fields.address, fio: fields.fio, phone: fields.phone }, fields.id);
    }

    constructor(fields = {}, id = null) {
        super(fields, id);
        if (!id && (fields.code !== undefined)) {
            this.id = Model.toIdFormat(fields.code);
        };

    }

    get name() {
        return this.fields.name;
    }

    get address() {
        return this.fields.address;
    }

    get fio() {
        return this.fields.fio;
    }

    get phone() {
        return this.fields.phone;
    }

}



class Operator extends Model {

    static unwrap(fields) {
        return new Operator({ name: fields.name, phone: fields.phone }, fields.id);
    }

    constructor(fields = {}, id = null) {
        super(fields, id);
        if (!id && (fields.code !== undefined)) {
            this.id = Model.toIdFormat(fields.code);
        };

    }

    get name() {
        return this.fields.name;
    }

    get phone() {
        return this.fields.phone;
    }

}











class LocalStorage {

    static objFromLS(object) { // return unwrap obj (finded by class input obj) from storage, if obj does not exist - return false.
        let typeObj = object.constructor.name;

        const objectData = localStorage.getItem(typeObj);

        if (String(objectData) == "null") { // check our object in storage browser. Can we do it better?
            return false
        };

        let unwrapObj = JSON.parse(objectData).map((fields) => {
            return object.constructor.unwrap(fields);
        });

        return unwrapObj;
    };

    static objLoadFromLS(nameArrOfObj) { //load arr of objects by type.
        const objectData = localStorage.getItem(nameArrOfObj);
        let object;

        if (String(objectData) == "null") { // check our object in storage browser. Can we do it better?
            return false;
        };

        switch (nameArrOfObj) {
            case NAME_DRILLERS_STORAGE:
                object = new Driller;
                break;

            case NAME_EQUIPMENTS_STORAGE:
                object = new Equipment;
                break;

            case NAME_PROJECTS_STORAGE:
                object = new Project;
                break;

            case NAME_OPERATORS_STORAGE:
                object = new Operator;
                break;


            default:
                console.log("Error, no arr with this type of obj");
        };

        let unwrapObj = JSON.parse(objectData).map((fields) => {
            return object.constructor.unwrap(fields);
        });

        return unwrapObj;
    };

    static getNewID(object) {
        let data = this.objFromLS(object);
        let idname = object.constructor["name"] + "#";
        let newid = idname + ((Math.random()) + "").slice(-6);

        if (data) {

            let arr = [];
            let switcher = 1;

            for (let key in data) { arr.push(data[key]._id) }; //create array id-s

            do {
                switcher = 0;

                for (let i = 0; i < arr.length; i++) {
                    if (newid == arr[i]) {
                        newid = idname + ((Math.random()) + "").slice(-6);;
                        switcher++;
                    }
                }

            } while (switcher != 0);

            return newid;


        } else {
            object._id = idname + ((Math.random()) + "").slice(-6);;
            return newid;
        };


    };




};

class SaveLoadStorage extends LocalStorage {
    // save new object to localstorage, with new unic generated id.
    save(object) {
        object._id = LocalStorage.getNewID(object);
        let data = LocalStorage.objFromLS(object);

        if (data) {
            data.push(object);
            console.log(data);
        } else data = [object];

        console.log(data);

        const jsonData = JSON.stringify(data);

        localStorage.setItem(object.constructor.name, jsonData);
    };

    saveEditedObj(object) { //overwrite obj in storage with same id 
        let data = LocalStorage.objFromLS(object);

        console.log(data);

        for (let key in data) {
            if (data[key]._id == object._id) {
                for (let key1 in data[key]._f) {
                    data[key]._f[key1] = object._f[key1];
                }
            }
        }

        console.log(data);

        const jsonData = JSON.stringify(data);

        localStorage.setItem(object.constructor.name, jsonData);
    };



    loadById(id) {
        id = LocalStorage.getNewID(object);
        console.log("poluchili id: ", id);
    };



    loadByType(nameArrOfObj) {
        let loadObj = LocalStorage.objLoadFromLS(nameArrOfObj);
        return loadObj;
    };



    newEmptyObj(type) { //return new empty obj by requested type
        switch (type) {
            case NAME_DRILLERS_STORAGE:
                return (new Driller({ name: "", code: "" }));

            case NAME_EQUIPMENTS_STORAGE:
                return (new Equipment({ type: "", code: "" }));

            case NAME_PROJECTS_STORAGE:
                return (new Project({ name: "", address: "", fio: "", phone: "" }));

            case NAME_OPERATORS_STORAGE:
                return (new Operator({ name: "", phone: "" }));


            default:
                console.log("error!")
        };
    };


};




class BaseStorage2 {




    all(cls) {
        let storage_name = cls.prototype.constructor.name;

        const wrapObj = localStorage.getItem(storage_name);

        if (wrapObj === null) { // check our object in storage browser
            console.log("no obj in storage with this cls");
            return false
        };

        let unwrapObj = JSON.parse(wrapObj).map((fields) => {
            return cls.prototype.constructor.unwrap(fields);
        });

        return unwrapObj;
    }

    save(object) {
        let storage_name = object.constructor.name;

        let data = localStorage.getItem(storage_name);
        let newAppropId = this._increase_id(object);

        if (data) {
            data = JSON.parse(data).map((fields) => {
                return object.constructor.unwrap(fields);
            });
        };

        if (data && newAppropId) {
            object._id = newAppropId;
            data.push(object);

        } else if (data) {

            for (let key in data) {
                if (data[key]._id == object._id) {

                    for (let key1 in data[key]._f) {
                        data[key]._f[key1] = object._f[key1];
                    }
                }
            }

        } else {
            object._id = newAppropId;
            data = [object];
        }

        data = JSON.stringify(data);
        localStorage.setItem(storage_name, data);

        return object._id;
    }

    load(cls, id) {
        throw new Error("Not implemented");
    }



    _increase_id(object) {
        if (object._id != null) return false;

        let lastId = localStorage.getItem("ids");
        let newAppropId = 0;

        if (lastId === null) { // where to transfer it for auto-init at startup?
            lastId = { "Driller": -1, "Equipment": -1, "Project": -1, "Operator": -1 };
        } else { lastId = JSON.parse(lastId) };


        for (let key in lastId) {

            if (object.constructor.name == key) {
                lastId[key]++;
                newAppropId = lastId[key];
                break;
            }

        }

        lastId = JSON.stringify(lastId);

        localStorage.setItem("ids", lastId);

        return newAppropId;
    }


    _newEmptyObj(type) { //return new empty obj by requested type
        switch (type) {
            case NAME_DRILLERS_STORAGE:
                return (new Driller({ name: "", code: "" }));

            case NAME_EQUIPMENTS_STORAGE:
                return (new Equipment({ type: "", code: "" }));

            case NAME_PROJECTS_STORAGE:
                return (new Project({ name: "", address: "", fio: "", phone: "" }));

            case NAME_OPERATORS_STORAGE:
                return (new Operator({ name: "", phone: "" }));


            default:
                console.log("error!")
        };
    };

}

class LocalStorage2 extends BaseStorage2 {


}