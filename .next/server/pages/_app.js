/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/ErrorBoundary.tsx":
/*!**************************************!*\
  !*** ./components/ErrorBoundary.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass ErrorBoundary extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {\n    constructor(props){\n        super(props);\n        this.state = {\n            hasError: false,\n            error: null\n        };\n    }\n    static getDerivedStateFromError(error) {\n        return {\n            hasError: true,\n            error\n        };\n    }\n    componentDidCatch(error, errorInfo) {\n        console.error(\"Error caught by boundary:\", error, errorInfo);\n    }\n    resetError = ()=>{\n        this.setState({\n            hasError: false,\n            error: null\n        });\n    };\n    render() {\n        if (this.state.hasError && this.state.error) {\n            const FallbackComponent = this.props.fallback;\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(FallbackComponent, {\n                error: this.state.error,\n                resetError: this.resetError\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/components/ErrorBoundary.tsx\",\n                lineNumber: 34,\n                columnNumber: 14\n            }, this);\n        }\n        return this.props.children;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorBoundary);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0Vycm9yQm91bmRhcnkudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBMEI7QUFZMUIsTUFBTUMsc0JBQXNCRCx3REFBZTtJQUN6Q0csWUFBWUMsS0FBWSxDQUFFO1FBQ3hCLEtBQUssQ0FBQ0E7UUFDTixJQUFJLENBQUNDLEtBQUssR0FBRztZQUFFQyxVQUFVLEtBQUs7WUFBRUMsT0FBTyxJQUFJO1FBQUM7SUFDOUM7SUFFQSxPQUFPQyx5QkFBeUJELEtBQVksRUFBUztRQUNuRCxPQUFPO1lBQUVELFVBQVUsSUFBSTtZQUFFQztRQUFNO0lBQ2pDO0lBRUFFLGtCQUFrQkYsS0FBWSxFQUFFRyxTQUEwQixFQUFFO1FBQzFEQyxRQUFRSixLQUFLLENBQUMsNkJBQTZCQSxPQUFPRztJQUNwRDtJQUVBRSxhQUFhLElBQU07UUFDakIsSUFBSSxDQUFDQyxRQUFRLENBQUM7WUFBRVAsVUFBVSxLQUFLO1lBQUVDLE9BQU8sSUFBSTtRQUFDO0lBQy9DLEVBQUU7SUFFRk8sU0FBUztRQUNQLElBQUksSUFBSSxDQUFDVCxLQUFLLENBQUNDLFFBQVEsSUFBSSxJQUFJLENBQUNELEtBQUssQ0FBQ0UsS0FBSyxFQUFFO1lBQzNDLE1BQU1RLG9CQUFvQixJQUFJLENBQUNYLEtBQUssQ0FBQ1ksUUFBUTtZQUM3QyxxQkFBTyw4REFBQ0Q7Z0JBQWtCUixPQUFPLElBQUksQ0FBQ0YsS0FBSyxDQUFDRSxLQUFLO2dCQUFFSyxZQUFZLElBQUksQ0FBQ0EsVUFBVTs7Ozs7O1FBQ2hGLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQ1IsS0FBSyxDQUFDYSxRQUFRO0lBQzVCO0FBQ0Y7QUFFQSxpRUFBZWhCLGFBQWFBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXRmbGl4LWNsb25lLy4vY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5LnRzeD9lMzBlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7XG4gIGZhbGxiYWNrOiBSZWFjdC5Db21wb25lbnRUeXBlPHsgZXJyb3I6IEVycm9yOyByZXNldEVycm9yOiAoKSA9PiB2b2lkIH0+O1xufVxuXG5pbnRlcmZhY2UgU3RhdGUge1xuICBoYXNFcnJvcjogYm9vbGVhbjtcbiAgZXJyb3I6IEVycm9yIHwgbnVsbDtcbn1cblxuY2xhc3MgRXJyb3JCb3VuZGFyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wcywgU3RhdGU+IHtcbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7IGhhc0Vycm9yOiBmYWxzZSwgZXJyb3I6IG51bGwgfTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IoZXJyb3I6IEVycm9yKTogU3RhdGUge1xuICAgIHJldHVybiB7IGhhc0Vycm9yOiB0cnVlLCBlcnJvciB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkQ2F0Y2goZXJyb3I6IEVycm9yLCBlcnJvckluZm86IFJlYWN0LkVycm9ySW5mbykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNhdWdodCBieSBib3VuZGFyeTonLCBlcnJvciwgZXJyb3JJbmZvKTtcbiAgfVxuXG4gIHJlc2V0RXJyb3IgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGhhc0Vycm9yOiBmYWxzZSwgZXJyb3I6IG51bGwgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc0Vycm9yICYmIHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIGNvbnN0IEZhbGxiYWNrQ29tcG9uZW50ID0gdGhpcy5wcm9wcy5mYWxsYmFjaztcbiAgICAgIHJldHVybiA8RmFsbGJhY2tDb21wb25lbnQgZXJyb3I9e3RoaXMuc3RhdGUuZXJyb3J9IHJlc2V0RXJyb3I9e3RoaXMucmVzZXRFcnJvcn0gLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW47XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JCb3VuZGFyeTsiXSwibmFtZXMiOlsiUmVhY3QiLCJFcnJvckJvdW5kYXJ5IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInN0YXRlIiwiaGFzRXJyb3IiLCJlcnJvciIsImdldERlcml2ZWRTdGF0ZUZyb21FcnJvciIsImNvbXBvbmVudERpZENhdGNoIiwiZXJyb3JJbmZvIiwiY29uc29sZSIsInJlc2V0RXJyb3IiLCJzZXRTdGF0ZSIsInJlbmRlciIsIkZhbGxiYWNrQ29tcG9uZW50IiwiZmFsbGJhY2siLCJjaGlsZHJlbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/ErrorBoundary.tsx\n");

/***/ }),

/***/ "./components/ErrorFallback.tsx":
/*!**************************************!*\
  !*** ./components/ErrorFallback.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ErrorFallback = ({ error , resetError  })=>{\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen bg-gray-900 flex items-center justify-center px-4\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"max-w-md w-full bg-gray-800 rounded-lg p-6 text-center\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"text-red-500 text-6xl mb-4\",\n                    children: \"⚠️\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 12,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                    className: \"text-2xl font-bold text-white mb-4\",\n                    children: \"حدث خطأ غير متوقع\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 13,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                    className: \"text-gray-300 mb-6\",\n                    children: \"عذراً، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 14,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"bg-gray-700 rounded p-3 mb-6 text-left\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"code\", {\n                        className: \"text-red-400 text-sm\",\n                        children: error.message\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                        lineNumber: 18,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 17,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    onClick: resetError,\n                    className: \"bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors\",\n                    children: \"إعادة المحاولة\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 20,\n                    columnNumber: 9\n                }, undefined)\n            ]\n        }, void 0, true, {\n            fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n            lineNumber: 11,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n        lineNumber: 10,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorFallback);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0Vycm9yRmFsbGJhY2sudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFBMEI7QUFPMUIsTUFBTUMsZ0JBQWlDLENBQUMsRUFBRUMsTUFBSyxFQUFFQyxXQUFVLEVBQUUsR0FBSztJQUNoRSxxQkFDRSw4REFBQ0M7UUFBSUMsV0FBVTtrQkFDYiw0RUFBQ0Q7WUFBSUMsV0FBVTs7OEJBQ2IsOERBQUNEO29CQUFJQyxXQUFVOzhCQUE2Qjs7Ozs7OzhCQUM1Qyw4REFBQ0M7b0JBQUdELFdBQVU7OEJBQXFDOzs7Ozs7OEJBQ25ELDhEQUFDRTtvQkFBRUYsV0FBVTs4QkFBcUI7Ozs7Ozs4QkFHbEMsOERBQUNEO29CQUFJQyxXQUFVOzhCQUNiLDRFQUFDRzt3QkFBS0gsV0FBVTtrQ0FBd0JILE1BQU1PLE9BQU87Ozs7Ozs7Ozs7OzhCQUV2RCw4REFBQ0M7b0JBQ0NDLFNBQVNSO29CQUNURSxXQUFVOzhCQUNYOzs7Ozs7Ozs7Ozs7Ozs7OztBQU1UO0FBRUEsaUVBQWVKLGFBQWFBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXRmbGl4LWNsb25lLy4vY29tcG9uZW50cy9FcnJvckZhbGxiYWNrLnRzeD9hNDQxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGVycm9yOiBFcnJvcjtcbiAgcmVzZXRFcnJvcjogKCkgPT4gdm9pZDtcbn1cblxuY29uc3QgRXJyb3JGYWxsYmFjazogUmVhY3QuRkM8UHJvcHM+ID0gKHsgZXJyb3IsIHJlc2V0RXJyb3IgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLWdyYXktOTAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTRcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctbWQgdy1mdWxsIGJnLWdyYXktODAwIHJvdW5kZWQtbGcgcC02IHRleHQtY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yZWQtNTAwIHRleHQtNnhsIG1iLTRcIj7imqDvuI88L2Rpdj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIG1iLTRcIj7Yrdiv2Ksg2K7Yt9ijINi62YrYsSDZhdiq2YjZgti5PC9oMT5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTMwMCBtYi02XCI+XG4gICAgICAgICAg2LnYsNix2KfZi9iMINit2K/YqyDYrti32KMg2YHZiiDYp9mE2KrYt9io2YrZgi4g2YrYsdis2Ykg2KfZhNmF2K3Yp9mI2YTYqSDZhdix2Kkg2KPYrtix2YkuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1ncmF5LTcwMCByb3VuZGVkIHAtMyBtYi02IHRleHQtbGVmdFwiPlxuICAgICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cInRleHQtcmVkLTQwMCB0ZXh0LXNtXCI+e2Vycm9yLm1lc3NhZ2V9PC9jb2RlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e3Jlc2V0RXJyb3J9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYmctcmVkLTYwMCBob3ZlcjpiZy1yZWQtNzAwIHRleHQtd2hpdGUgZm9udC1ib2xkIHB5LTIgcHgtNCByb3VuZGVkIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgPlxuICAgICAgICAgINil2LnYp9iv2Kkg2KfZhNmF2K3Yp9mI2YTYqVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JGYWxsYmFjazsiXSwibmFtZXMiOlsiUmVhY3QiLCJFcnJvckZhbGxiYWNrIiwiZXJyb3IiLCJyZXNldEVycm9yIiwiZGl2IiwiY2xhc3NOYW1lIiwiaDEiLCJwIiwiY29kZSIsIm1lc3NhZ2UiLCJidXR0b24iLCJvbkNsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/ErrorFallback.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/ErrorBoundary */ \"./components/ErrorBoundary.tsx\");\n/* harmony import */ var _components_ErrorFallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/ErrorFallback */ \"./components/ErrorFallback.tsx\");\n\n\n\n\n\nfunction App({ Component , pageProps  }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n        fallback: _components_ErrorFallback__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n            session: pageProps.session,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                lineNumber: 11,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/runner/workspace/pages/_app.tsx\",\n            lineNumber: 10,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/pages/_app.tsx\",\n        lineNumber: 9,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUErQjtBQUVtQjtBQUNNO0FBQ0E7QUFFekMsU0FBU0csSUFBSSxFQUFFQyxVQUFTLEVBQUVDLFVBQVMsRUFBWSxFQUFFO0lBQzlELHFCQUNFLDhEQUFDSixpRUFBYUE7UUFBQ0ssVUFBVUosaUVBQWFBO2tCQUNwQyw0RUFBQ0YsNERBQWVBO1lBQUNPLFNBQVNGLFVBQVVFLE9BQU87c0JBQ3pDLDRFQUFDSDtnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FBSWhDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXRmbGl4LWNsb25lLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tIFwibmV4dC9hcHBcIjtcbmltcG9ydCB7IFNlc3Npb25Qcm92aWRlciB9IGZyb20gXCJuZXh0LWF1dGgvcmVhY3RcIjtcbmltcG9ydCBFcnJvckJvdW5kYXJ5IGZyb20gXCIuLi9jb21wb25lbnRzL0Vycm9yQm91bmRhcnlcIjtcbmltcG9ydCBFcnJvckZhbGxiYWNrIGZyb20gXCIuLi9jb21wb25lbnRzL0Vycm9yRmFsbGJhY2tcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8RXJyb3JCb3VuZGFyeSBmYWxsYmFjaz17RXJyb3JGYWxsYmFja30+XG4gICAgICA8U2Vzc2lvblByb3ZpZGVyIHNlc3Npb249e3BhZ2VQcm9wcy5zZXNzaW9ufT5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9TZXNzaW9uUHJvdmlkZXI+XG4gICAgPC9FcnJvckJvdW5kYXJ5PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlNlc3Npb25Qcm92aWRlciIsIkVycm9yQm91bmRhcnkiLCJFcnJvckZhbGxiYWNrIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiZmFsbGJhY2siLCJzZXNzaW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-auth/react");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();