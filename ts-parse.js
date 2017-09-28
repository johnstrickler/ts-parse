define("Helper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Utility functions
     */
    var Helper = /** @class */ (function () {
        function Helper() {
        }
        Helper.isUndefined = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.some(function (o) { return typeof o === 'undefined'; });
        };
        Helper.isUndefinedOrNull = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.some(function (o) { return typeof o === 'undefined' || o === null; });
        };
        Helper.isMapOrSet = function (type) {
            return [Map, WeakMap, Set, WeakSet].indexOf(type) > -1;
        };
        Helper.excludeKeys = function (json, keys) {
            return Object.keys(json)
                .filter(function (key) { return !keys.includes(key); })
                .reduce(function (obj, key) {
                obj[key] = json[key];
                return obj;
            }, {});
        };
        return Helper;
    }());
    exports.Helper = Helper;
});
define("Metadata", ["require", "exports", "Helper", "get-parameter-names"], function (require, exports, Helper_1, getParameterNames) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CONSTRUCTOR_METADATA = Symbol('Constructors');
    /**
     * ConstructorMetadata
     *
     * Constructed through decorators.
     * It doesn't matter the order in which decorators are evaluated and called
     * the final/mapped/compiled metadata can be accessed through getParameterMetadataByName
     */
    var ConstructorMetadata = /** @class */ (function () {
        function ConstructorMetadata(target) {
            this._types = [];
            this._elementTypes = {};
            this.target = target;
            this._names = getParameterNames(target);
        }
        // if one does not exist, then one is created and the metadata is defined
        ConstructorMetadata.getMetadata = function (target) {
            var constructorMetadata = Reflect.getOwnMetadata(exports.CONSTRUCTOR_METADATA, target);
            if (Helper_1.Helper.isUndefined(constructorMetadata)) {
                constructorMetadata = new ConstructorMetadata(target);
                Reflect.defineMetadata(exports.CONSTRUCTOR_METADATA, constructorMetadata, target);
            }
            return constructorMetadata;
        };
        ConstructorMetadata.prototype.setTypes = function (types) {
            this._types = [].concat(types);
        };
        ConstructorMetadata.prototype.setElementType = function (index, elementType) {
            this._elementTypes[index] = elementType;
        };
        ConstructorMetadata.prototype.getNames = function () {
            return [].concat(this._names);
        };
        ConstructorMetadata.prototype.getParameterMetadataByIndex = function (index) {
            if (!this._names[index]) {
                return;
            }
            // TODO in STRICT MODE, throw error
            // if (Helper.isUndefined(this._types)) {
            //   throw new Error(
            //     `@Serializable() is missing from ${this.target.name || 'Anonymous'}.  ` +
            //     `Constructor metadata cannot be determined.`);
            // }
            var elementType = this._elementTypes[index];
            // infer an anonymous function as being a wrapper function and not a type
            if (elementType && elementType.name === '') {
                elementType = elementType();
            }
            return new ParameterMetadata(index, this._names[index], this._types[index], elementType);
        };
        ConstructorMetadata.prototype.getAllParameterMetadata = function () {
            var _this = this;
            return this._names.map(function (name, index) { return _this.getParameterMetadataByIndex(index); });
        };
        return ConstructorMetadata;
    }());
    exports.ConstructorMetadata = ConstructorMetadata;
    /**
     * ParameterMetadata
     */
    var ParameterMetadata = /** @class */ (function () {
        function ParameterMetadata(_index, _name, _type, _elementType) {
            this._index = _index;
            this._name = _name;
            this._type = _type;
            this._elementType = _elementType;
            this._elementType = _elementType || _type;
        }
        Object.defineProperty(ParameterMetadata.prototype, "name", {
            get: function () { return this._name; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ParameterMetadata.prototype, "elementType", {
            get: function () { return this._elementType; },
            enumerable: true,
            configurable: true
        });
        ;
        return ParameterMetadata;
    }());
    exports.ParameterMetadata = ParameterMetadata;
});
define("Tson", ["require", "exports", "Metadata", "Helper", "reflect-metadata"], function (require, exports, Metadata_1, Helper_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PRIMITIVE_CONVERSIONS = new Map([
        [Boolean, function (v) { return !!v; }],
        [Number, function (v) { return +v; }],
        [String, function (v) { return Helper_2.Helper.isUndefinedOrNull(v) ? '' : v + ''; }]
    ]);
    var PRIMITIVE_TYPES = new Map([
        ["boolean", Boolean],
        ["number", Number],
        ["string", String]
    ]);
    // TODO implement strict typing where every object has to be constructed
    // const configuration = {
    //   strict: false
    // };
    // TODO target environments
    // Browser - (angular4)
    // Node/Express ?
    // ?
    /**
     * Parses JSON or an object literal to a typed instance
     *
     * @param json
     * @param {Newable<T>} type
     * @returns {T}
     */
    function parse(json, type) {
        // check first
        if (Helper_2.Helper.isUndefinedOrNull(json)) {
            return null;
        }
        // do not recurse further
        if (Helper_2.Helper.isUndefinedOrNull(type)) {
            // TODO strict mode - should we fail? not knowing the type should be okay
            return json;
        }
        // do before array-check
        if (Helper_2.Helper.isMapOrSet(type)) {
            return new type(json);
        }
        //
        if (Array.isArray(json)) {
            // force to a false type assertion
            return json.map(function (o) { return parse(o, type); });
        }
        if (PRIMITIVE_TYPES.get(typeof json) === type) {
            return json;
        }
        var constructorMetadata = Metadata_1.ConstructorMetadata.getMetadata(type);
        if (PRIMITIVE_TYPES.has(typeof json)) {
            // TODO strict mode - primitive conversion
            if (PRIMITIVE_CONVERSIONS.has(type)) {
                return PRIMITIVE_CONVERSIONS.get(type)(json);
            }
            if (constructorMetadata.getNames().length < 2) {
                // useful for constructing objects that take a primitive
                // as a parameter such as Dates, Moments, ...
                // TODO fail in STRICT MODE - we are constructing where types MIGHT mismatch
                return new type(json);
            }
            else {
                // Can't infer because the JSON is a primitive and type has more than 1 argument
                // TODO STRICT MODE - we have a Type but it could not be serialized
                return json;
            }
        }
        var constructorArgs = constructorMetadata.getAllParameterMetadata()
            .map(function (parameterMetadata) {
            return parse(json[parameterMetadata.name], parameterMetadata.elementType);
        });
        var extraProperties = Helper_2.Helper.excludeKeys(json, constructorMetadata.getNames());
        var instance = new (type.bind.apply(type, [void 0].concat(constructorArgs)))();
        Object.assign(instance, extraProperties);
        return instance;
    }
    /**
     * API
     */
    exports.TSON = {
        /**
         * @param json json input can be a string (which will be parsed using JSON.parse, or an object, or an array)
         * @param {Newable<T>} type  the root type to be returned, nested types will be determined through decorators.  if decorators are not present then generic objects will be returned in place of a actual class instance
         * @returns {T} the class instance or array of class instances
         */
        parse: function (json, type) {
            return parse(JSON.parse(json), type);
        }
    };
});
define("Decorators", ["require", "exports", "Helper", "Metadata"], function (require, exports, Helper_3, Metadata_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * ElementType Decorator
     *
     * ElementType exposes an Array's inner type.
     *
     * See: https://github.com/Microsoft/TypeScript/issues/7169
     *
     * @param {Newable} type
     * @returns {(target: Newable, propertyKey: string, parameterIndex: number) => any}
     * @constructor
     */
    function ElementType(type) {
        return function (target, propertyKey, parameterIndex) {
            Metadata_2.ConstructorMetadata.getMetadata(target).setElementType(parameterIndex, type);
        };
    }
    exports.ElementType = ElementType;
    /**
     * Serializable Decorator
     *
     * @returns {(target: Newable) => any}
     * @constructor
     */
    function Serializable() {
        return function (target) {
            var parameterTypes = Reflect.getOwnMetadata("design:paramtypes", target);
            var constructorMetadata = Metadata_2.ConstructorMetadata.getMetadata(target);
            constructorMetadata.setTypes(parameterTypes);
            if (Array.isArray(parameterTypes)) {
                parameterTypes.forEach(function (type, index) {
                    if (Helper_3.Helper.isUndefined(type)) {
                        var parameterMetadata = constructorMetadata.getParameterMetadataByIndex(index);
                        throw new Error("Parameter type is undefined.  [class=\"" + target.name + "\"] [parameter=" + parameterMetadata.name + "] [index=" + index + "] " +
                            "Dependency is defined after it is used (known bug with Reflection Metadata) " +
                            "See https://github.com/Microsoft/TypeScript/issues/4114");
                    }
                });
            }
            if (Helper_3.Helper.isUndefined(parameterTypes)) {
                // TODO explicit constructor is missing. assume no-args constructor
            }
        };
    }
    exports.Serializable = Serializable;
});
//# sourceMappingURL=ts-parse.js.map