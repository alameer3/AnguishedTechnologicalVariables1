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

/***/ "(pages-dir-node)/./components/ErrorBoundary.tsx":
/*!**************************************!*\
  !*** ./components/ErrorBoundary.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass ErrorBoundary extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {\n    constructor(props){\n        super(props), this.resetError = ()=>{\n            this.setState({\n                hasError: false,\n                error: null\n            });\n        };\n        this.state = {\n            hasError: false,\n            error: null\n        };\n    }\n    static getDerivedStateFromError(error) {\n        return {\n            hasError: true,\n            error\n        };\n    }\n    componentDidCatch(error, errorInfo) {\n        console.error('Error caught by boundary:', error, errorInfo);\n    }\n    render() {\n        if (this.state.hasError && this.state.error) {\n            const FallbackComponent = this.props.fallback;\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(FallbackComponent, {\n                error: this.state.error,\n                resetError: this.resetError\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/components/ErrorBoundary.tsx\",\n                lineNumber: 34,\n                columnNumber: 14\n            }, this);\n        }\n        return this.props.children;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorBoundary);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvRXJyb3JCb3VuZGFyeS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTBCO0FBWTFCLE1BQU1DLHNCQUFzQkQsd0RBQWU7SUFDekMsWUFBWUcsS0FBWSxDQUFFO1FBQ3hCLEtBQUssQ0FBQ0EsYUFZUkMsYUFBYTtZQUNYLElBQUksQ0FBQ0MsUUFBUSxDQUFDO2dCQUFFQyxVQUFVO2dCQUFPQyxPQUFPO1lBQUs7UUFDL0M7UUFiRSxJQUFJLENBQUNDLEtBQUssR0FBRztZQUFFRixVQUFVO1lBQU9DLE9BQU87UUFBSztJQUM5QztJQUVBLE9BQU9FLHlCQUF5QkYsS0FBWSxFQUFTO1FBQ25ELE9BQU87WUFBRUQsVUFBVTtZQUFNQztRQUFNO0lBQ2pDO0lBRUFHLGtCQUFrQkgsS0FBWSxFQUFFSSxTQUEwQixFQUFFO1FBQzFEQyxRQUFRTCxLQUFLLENBQUMsNkJBQTZCQSxPQUFPSTtJQUNwRDtJQU1BRSxTQUFTO1FBQ1AsSUFBSSxJQUFJLENBQUNMLEtBQUssQ0FBQ0YsUUFBUSxJQUFJLElBQUksQ0FBQ0UsS0FBSyxDQUFDRCxLQUFLLEVBQUU7WUFDM0MsTUFBTU8sb0JBQW9CLElBQUksQ0FBQ1gsS0FBSyxDQUFDWSxRQUFRO1lBQzdDLHFCQUFPLDhEQUFDRDtnQkFBa0JQLE9BQU8sSUFBSSxDQUFDQyxLQUFLLENBQUNELEtBQUs7Z0JBQUVILFlBQVksSUFBSSxDQUFDQSxVQUFVOzs7Ozs7UUFDaEY7UUFFQSxPQUFPLElBQUksQ0FBQ0QsS0FBSyxDQUFDYSxRQUFRO0lBQzVCO0FBQ0Y7QUFFQSxpRUFBZWYsYUFBYUEsRUFBQyIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9jb21wb25lbnRzL0Vycm9yQm91bmRhcnkudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7XG4gIGZhbGxiYWNrOiBSZWFjdC5Db21wb25lbnRUeXBlPHsgZXJyb3I6IEVycm9yOyByZXNldEVycm9yOiAoKSA9PiB2b2lkIH0+O1xufVxuXG5pbnRlcmZhY2UgU3RhdGUge1xuICBoYXNFcnJvcjogYm9vbGVhbjtcbiAgZXJyb3I6IEVycm9yIHwgbnVsbDtcbn1cblxuY2xhc3MgRXJyb3JCb3VuZGFyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wcywgU3RhdGU+IHtcbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7IGhhc0Vycm9yOiBmYWxzZSwgZXJyb3I6IG51bGwgfTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IoZXJyb3I6IEVycm9yKTogU3RhdGUge1xuICAgIHJldHVybiB7IGhhc0Vycm9yOiB0cnVlLCBlcnJvciB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkQ2F0Y2goZXJyb3I6IEVycm9yLCBlcnJvckluZm86IFJlYWN0LkVycm9ySW5mbykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNhdWdodCBieSBib3VuZGFyeTonLCBlcnJvciwgZXJyb3JJbmZvKTtcbiAgfVxuXG4gIHJlc2V0RXJyb3IgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGhhc0Vycm9yOiBmYWxzZSwgZXJyb3I6IG51bGwgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc0Vycm9yICYmIHRoaXMuc3RhdGUuZXJyb3IpIHtcbiAgICAgIGNvbnN0IEZhbGxiYWNrQ29tcG9uZW50ID0gdGhpcy5wcm9wcy5mYWxsYmFjaztcbiAgICAgIHJldHVybiA8RmFsbGJhY2tDb21wb25lbnQgZXJyb3I9e3RoaXMuc3RhdGUuZXJyb3J9IHJlc2V0RXJyb3I9e3RoaXMucmVzZXRFcnJvcn0gLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW47XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JCb3VuZGFyeTsiXSwibmFtZXMiOlsiUmVhY3QiLCJFcnJvckJvdW5kYXJ5IiwiQ29tcG9uZW50IiwicHJvcHMiLCJyZXNldEVycm9yIiwic2V0U3RhdGUiLCJoYXNFcnJvciIsImVycm9yIiwic3RhdGUiLCJnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IiLCJjb21wb25lbnREaWRDYXRjaCIsImVycm9ySW5mbyIsImNvbnNvbGUiLCJyZW5kZXIiLCJGYWxsYmFja0NvbXBvbmVudCIsImZhbGxiYWNrIiwiY2hpbGRyZW4iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/ErrorBoundary.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./components/ErrorFallback.tsx":
/*!**************************************!*\
  !*** ./components/ErrorFallback.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ErrorFallback = ({ error, resetError })=>{\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen bg-gray-900 flex items-center justify-center px-4\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"max-w-md w-full bg-gray-800 rounded-lg p-6 text-center\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"text-red-500 text-6xl mb-4\",\n                    children: \"⚠️\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 12,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                    className: \"text-2xl font-bold text-white mb-4\",\n                    children: \"حدث خطأ غير متوقع\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 13,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                    className: \"text-gray-300 mb-6\",\n                    children: \"عذراً، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 14,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"bg-gray-700 rounded p-3 mb-6 text-left\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"code\", {\n                        className: \"text-red-400 text-sm\",\n                        children: error.message\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                        lineNumber: 18,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 17,\n                    columnNumber: 9\n                }, undefined),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    onClick: resetError,\n                    className: \"bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors\",\n                    children: \"إعادة المحاولة\"\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n                    lineNumber: 20,\n                    columnNumber: 9\n                }, undefined)\n            ]\n        }, void 0, true, {\n            fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n            lineNumber: 11,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/components/ErrorFallback.tsx\",\n        lineNumber: 10,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorFallback);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvRXJyb3JGYWxsYmFjay50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTBCO0FBTzFCLE1BQU1DLGdCQUFpQyxDQUFDLEVBQUVDLEtBQUssRUFBRUMsVUFBVSxFQUFFO0lBQzNELHFCQUNFLDhEQUFDQztRQUFJQyxXQUFVO2tCQUNiLDRFQUFDRDtZQUFJQyxXQUFVOzs4QkFDYiw4REFBQ0Q7b0JBQUlDLFdBQVU7OEJBQTZCOzs7Ozs7OEJBQzVDLDhEQUFDQztvQkFBR0QsV0FBVTs4QkFBcUM7Ozs7Ozs4QkFDbkQsOERBQUNFO29CQUFFRixXQUFVOzhCQUFxQjs7Ozs7OzhCQUdsQyw4REFBQ0Q7b0JBQUlDLFdBQVU7OEJBQ2IsNEVBQUNHO3dCQUFLSCxXQUFVO2tDQUF3QkgsTUFBTU8sT0FBTzs7Ozs7Ozs7Ozs7OEJBRXZELDhEQUFDQztvQkFDQ0MsU0FBU1I7b0JBQ1RFLFdBQVU7OEJBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTVQ7QUFFQSxpRUFBZUosYUFBYUEsRUFBQyIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9jb21wb25lbnRzL0Vycm9yRmFsbGJhY2sudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGVycm9yOiBFcnJvcjtcbiAgcmVzZXRFcnJvcjogKCkgPT4gdm9pZDtcbn1cblxuY29uc3QgRXJyb3JGYWxsYmFjazogUmVhY3QuRkM8UHJvcHM+ID0gKHsgZXJyb3IsIHJlc2V0RXJyb3IgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLWdyYXktOTAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTRcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctbWQgdy1mdWxsIGJnLWdyYXktODAwIHJvdW5kZWQtbGcgcC02IHRleHQtY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yZWQtNTAwIHRleHQtNnhsIG1iLTRcIj7imqDvuI88L2Rpdj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIG1iLTRcIj7Yrdiv2Ksg2K7Yt9ijINi62YrYsSDZhdiq2YjZgti5PC9oMT5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTMwMCBtYi02XCI+XG4gICAgICAgICAg2LnYsNix2KfZi9iMINit2K/YqyDYrti32KMg2YHZiiDYp9mE2KrYt9io2YrZgi4g2YrYsdis2Ykg2KfZhNmF2K3Yp9mI2YTYqSDZhdix2Kkg2KPYrtix2YkuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1ncmF5LTcwMCByb3VuZGVkIHAtMyBtYi02IHRleHQtbGVmdFwiPlxuICAgICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cInRleHQtcmVkLTQwMCB0ZXh0LXNtXCI+e2Vycm9yLm1lc3NhZ2V9PC9jb2RlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e3Jlc2V0RXJyb3J9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYmctcmVkLTYwMCBob3ZlcjpiZy1yZWQtNzAwIHRleHQtd2hpdGUgZm9udC1ib2xkIHB5LTIgcHgtNCByb3VuZGVkIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgPlxuICAgICAgICAgINil2LnYp9iv2Kkg2KfZhNmF2K3Yp9mI2YTYqVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JGYWxsYmFjazsiXSwibmFtZXMiOlsiUmVhY3QiLCJFcnJvckZhbGxiYWNrIiwiZXJyb3IiLCJyZXNldEVycm9yIiwiZGl2IiwiY2xhc3NOYW1lIiwiaDEiLCJwIiwiY29kZSIsIm1lc3NhZ2UiLCJidXR0b24iLCJvbkNsaWNrIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/ErrorFallback.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var _components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/ErrorBoundary */ \"(pages-dir-node)/./components/ErrorBoundary.tsx\");\n/* harmony import */ var _components_ErrorFallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/ErrorFallback */ \"(pages-dir-node)/./components/ErrorFallback.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([next_auth_react__WEBPACK_IMPORTED_MODULE_2__]);\nnext_auth_react__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n        fallback: _components_ErrorFallback__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n            session: pageProps.session,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/pages/_app.tsx\",\n                lineNumber: 11,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/runner/workspace/pages/_app.tsx\",\n            lineNumber: 10,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/pages/_app.tsx\",\n        lineNumber: 9,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUErQjtBQUVtQjtBQUNNO0FBQ0E7QUFFekMsU0FBU0csSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFDRSw4REFBQ0osaUVBQWFBO1FBQUNLLFVBQVVKLGlFQUFhQTtrQkFDcEMsNEVBQUNGLDREQUFlQTtZQUFDTyxTQUFTRixVQUFVRSxPQUFPO3NCQUN6Qyw0RUFBQ0g7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7OztBQUloQyIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9wYWdlcy9fYXBwLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tIFwibmV4dC9hcHBcIjtcbmltcG9ydCB7IFNlc3Npb25Qcm92aWRlciB9IGZyb20gXCJuZXh0LWF1dGgvcmVhY3RcIjtcbmltcG9ydCBFcnJvckJvdW5kYXJ5IGZyb20gXCIuLi9jb21wb25lbnRzL0Vycm9yQm91bmRhcnlcIjtcbmltcG9ydCBFcnJvckZhbGxiYWNrIGZyb20gXCIuLi9jb21wb25lbnRzL0Vycm9yRmFsbGJhY2tcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8RXJyb3JCb3VuZGFyeSBmYWxsYmFjaz17RXJyb3JGYWxsYmFja30+XG4gICAgICA8U2Vzc2lvblByb3ZpZGVyIHNlc3Npb249e3BhZ2VQcm9wcy5zZXNzaW9ufT5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9TZXNzaW9uUHJvdmlkZXI+XG4gICAgPC9FcnJvckJvdW5kYXJ5PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlNlc3Npb25Qcm92aWRlciIsIkVycm9yQm91bmRhcnkiLCJFcnJvckZhbGxiYWNrIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiZmFsbGJhY2siLCJzZXNzaW9uIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
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
module.exports = import("next-auth/react");;

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
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();