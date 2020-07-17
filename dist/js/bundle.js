/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// import * as d3chart from './d3chart';\n// import * as d3 from 'd3';\n\nconst state ={};\n\ninit();\n\nfunction init(){\n    state.active_bar = \"barchart\";\n    state.active_pie = \"piechart\";\n    state.active_line = \"timeserieschart\";\n    state.active_paragraph =\"code_example_1\";\n    \n}\n\ndocument.getElementById(\"bar_button\").addEventListener('click', event =>{\n    const barcharts = [\"barchart\",\"scatterplot\",\"boxplot\"];\n    const index = (barcharts.indexOf(state.active_bar)+1)%barcharts.length;\n    document.getElementById(state.active_bar).classList.toggle(\"active\");\n    state.active_bar = barcharts[index];\n    document.getElementById(state.active_bar).classList.toggle(\"active\");\n\n});\n\ndocument.getElementById(\"pie_button\").addEventListener('click', event =>{\n    const piecharts = [\"piechart\",\"stackareachart\",\"donutchart\"];\n    const index = (piecharts.indexOf(state.active_pie)+1)%piecharts.length;\n    document.getElementById(state.active_pie).classList.toggle(\"active\");\n    state.active_pie = piecharts[index];\n    document.getElementById(state.active_pie).classList.toggle(\"active\");\n\n});\n\ndocument.getElementById(\"line_button\").addEventListener('click', event =>{\n    const linecharts = [\"timeserieschart\",\"areachart\",\"dragforce\"];\n    const index = (linecharts.indexOf(state.active_line)+1)%linecharts.length;\n    document.getElementById(state.active_line).classList.toggle(\"active\");\n    state.active_line = linecharts[index];\n    document.getElementById(state.active_line).classList.toggle(\"active\");\n\n});\n\ndocument.getElementById(\"composition__photo--1\").addEventListener('mouseover', event => {\n    if (state.active_paragraph!=\"code_example_1\"){\n        document.getElementById(state.active_paragraph).classList.toggle(\"active\");\n        state.active_paragraph = \"code_example_1\";\n        document.getElementById(state.active_paragraph).classList.toggle(\"active\");\n    }\n   \n});\n\ndocument.getElementById(\"composition__photo--2\").addEventListener('mouseover', event => {\n    if (state.active_paragraph!=\"code_example_2\"){\n        document.getElementById(state.active_paragraph).classList.toggle(\"active\");\n        state.active_paragraph = \"code_example_2\";\n        document.getElementById(state.active_paragraph).classList.toggle(\"active\");\n    }\n});\n\ndocument.getElementById(\"composition__photo--3\").addEventListener('mouseover', event => {\n    if (state.active_paragraph!=\"code_example_3\"){\n        document.getElementById(state.active_paragraph).classList.toggle(\"active\");\n        state.active_paragraph = \"code_example_3\";\n        document.getElementById(state.active_paragraph).classList.toggle(\"active\");\n    }\n})\n\n\n\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ })

/******/ });