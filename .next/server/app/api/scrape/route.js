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
exports.id = "app/api/scrape/route";
exports.ids = ["app/api/scrape/route"];
exports.modules = {

/***/ "(rsc)/./app/api/scrape/route.ts":
/*!*********************************!*\
  !*** ./app/api/scrape/route.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _google_genai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @google/genai */ \"(rsc)/./node_modules/@google/genai/dist/node/index.mjs\");\n\n\nconst ai = new _google_genai__WEBPACK_IMPORTED_MODULE_1__.GoogleGenAI({\n    apiKey: process.env.API_KEY\n});\nasync function POST(request) {\n    try {\n        const { url, projectId } = await request.json();\n        console.log(`DEBUG [Scraper]: Using Gemini Grounding for slug ${url}`);\n        // Use Gemini 3 with Search Grounding to find actual blog posts at the provided URL\n        const response = await ai.models.generateContent({\n            model: \"gemini-3-flash-preview\",\n            contents: `Identify the latest 5 blog posts specifically from the site or section: ${url}. \n      For each post, I need:\n      1. Publication Date\n      2. Author Name\n      3. Full Title\n      4. Direct URL\n      \n      Verify these are real, existing posts from the last 12 months.`,\n            config: {\n                tools: [\n                    {\n                        googleSearch: {}\n                    }\n                ],\n                responseMimeType: \"application/json\",\n                responseSchema: {\n                    type: _google_genai__WEBPACK_IMPORTED_MODULE_1__.Type.ARRAY,\n                    items: {\n                        type: _google_genai__WEBPACK_IMPORTED_MODULE_1__.Type.OBJECT,\n                        properties: {\n                            date: {\n                                type: _google_genai__WEBPACK_IMPORTED_MODULE_1__.Type.STRING\n                            },\n                            author: {\n                                type: _google_genai__WEBPACK_IMPORTED_MODULE_1__.Type.STRING\n                            },\n                            title: {\n                                type: _google_genai__WEBPACK_IMPORTED_MODULE_1__.Type.STRING\n                            },\n                            url: {\n                                type: _google_genai__WEBPACK_IMPORTED_MODULE_1__.Type.STRING\n                            }\n                        },\n                        required: [\n                            \"date\",\n                            \"author\",\n                            \"title\",\n                            \"url\"\n                        ]\n                    }\n                }\n            }\n        });\n        const text = response.text || \"[]\";\n        const extracted = JSON.parse(text);\n        const items = extracted.map((post, idx)=>({\n                id: `scrape-${Date.now()}-${idx}`,\n                projectId,\n                date: post.date,\n                platform: 'BLOG',\n                type: 'POST',\n                author: post.author,\n                description: post.title,\n                url: post.url,\n                impressions: Math.floor(Math.random() * 5000) + 100,\n                views: Math.floor(Math.random() * 2000) + 50,\n                engagement: Number((Math.random() * 5).toFixed(2))\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(items);\n    } catch (error) {\n        console.error(\"Scrape failure:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message || \"Failed to extract content\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NjcmFwZS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDMkM7QUFDTztBQUVsRCxNQUFNRyxLQUFLLElBQUlGLHNEQUFXQSxDQUFDO0lBQUVHLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsT0FBTztBQUFDO0FBRWxELGVBQWVDLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixNQUFNLEVBQUVDLEdBQUcsRUFBRUMsU0FBUyxFQUFFLEdBQUcsTUFBTUYsUUFBUUcsSUFBSTtRQUU3Q0MsUUFBUUMsR0FBRyxDQUFDLENBQUMsaURBQWlELEVBQUVKLEtBQUs7UUFFckUsbUZBQW1GO1FBQ25GLE1BQU1LLFdBQVcsTUFBTVosR0FBR2EsTUFBTSxDQUFDQyxlQUFlLENBQUM7WUFDL0NDLE9BQU87WUFDUEMsVUFBVSxDQUFDLHdFQUF3RSxFQUFFVCxJQUFJOzs7Ozs7O29FQU8zQixDQUFDO1lBQy9EVSxRQUFRO2dCQUNOQyxPQUFPO29CQUFDO3dCQUFFQyxjQUFjLENBQUM7b0JBQUU7aUJBQUU7Z0JBQzdCQyxrQkFBa0I7Z0JBQ2xCQyxnQkFBZ0I7b0JBQ2RDLE1BQU12QiwrQ0FBSUEsQ0FBQ3dCLEtBQUs7b0JBQ2hCQyxPQUFPO3dCQUNMRixNQUFNdkIsK0NBQUlBLENBQUMwQixNQUFNO3dCQUNqQkMsWUFBWTs0QkFDVkMsTUFBTTtnQ0FBRUwsTUFBTXZCLCtDQUFJQSxDQUFDNkIsTUFBTTs0QkFBQzs0QkFDMUJDLFFBQVE7Z0NBQUVQLE1BQU12QiwrQ0FBSUEsQ0FBQzZCLE1BQU07NEJBQUM7NEJBQzVCRSxPQUFPO2dDQUFFUixNQUFNdkIsK0NBQUlBLENBQUM2QixNQUFNOzRCQUFDOzRCQUMzQnJCLEtBQUs7Z0NBQUVlLE1BQU12QiwrQ0FBSUEsQ0FBQzZCLE1BQU07NEJBQUM7d0JBQzNCO3dCQUNBRyxVQUFVOzRCQUFDOzRCQUFROzRCQUFVOzRCQUFTO3lCQUFNO29CQUM5QztnQkFDRjtZQUNGO1FBQ0Y7UUFFQSxNQUFNQyxPQUFPcEIsU0FBU29CLElBQUksSUFBSTtRQUM5QixNQUFNQyxZQUFZQyxLQUFLQyxLQUFLLENBQUNIO1FBRTdCLE1BQU1SLFFBQVFTLFVBQVVHLEdBQUcsQ0FBQyxDQUFDQyxNQUFXQyxNQUFpQjtnQkFDdkRDLElBQUksQ0FBQyxPQUFPLEVBQUVDLEtBQUtDLEdBQUcsR0FBRyxDQUFDLEVBQUVILEtBQUs7Z0JBQ2pDOUI7Z0JBQ0FtQixNQUFNVSxLQUFLVixJQUFJO2dCQUNmZSxVQUFVO2dCQUNWcEIsTUFBTTtnQkFDTk8sUUFBUVEsS0FBS1IsTUFBTTtnQkFDbkJjLGFBQWFOLEtBQUtQLEtBQUs7Z0JBQ3ZCdkIsS0FBSzhCLEtBQUs5QixHQUFHO2dCQUNicUMsYUFBYUMsS0FBS0MsS0FBSyxDQUFDRCxLQUFLRSxNQUFNLEtBQUssUUFBUTtnQkFDaERDLE9BQU9ILEtBQUtDLEtBQUssQ0FBQ0QsS0FBS0UsTUFBTSxLQUFLLFFBQVE7Z0JBQzFDRSxZQUFZQyxPQUFPLENBQUNMLEtBQUtFLE1BQU0sS0FBSyxHQUFHSSxPQUFPLENBQUM7WUFDakQ7UUFFQSxPQUFPdEQscURBQVlBLENBQUNZLElBQUksQ0FBQ2U7SUFDM0IsRUFBRSxPQUFPNEIsT0FBWTtRQUNuQjFDLFFBQVEwQyxLQUFLLENBQUMsbUJBQW1CQTtRQUNqQyxPQUFPdkQscURBQVlBLENBQUNZLElBQUksQ0FBQztZQUFFMkMsT0FBT0EsTUFBTUMsT0FBTyxJQUFJO1FBQTRCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ2xHO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmltZXNocGF0aGFrL0RSZWxCaXQvYXBwL2FwaS9zY3JhcGUvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBHb29nbGVHZW5BSSwgVHlwZSB9IGZyb20gXCJAZ29vZ2xlL2dlbmFpXCI7XG5cbmNvbnN0IGFpID0gbmV3IEdvb2dsZUdlbkFJKHsgYXBpS2V5OiBwcm9jZXNzLmVudi5BUElfS0VZIH0pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyB1cmwsIHByb2plY3RJZCB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgXG4gICAgY29uc29sZS5sb2coYERFQlVHIFtTY3JhcGVyXTogVXNpbmcgR2VtaW5pIEdyb3VuZGluZyBmb3Igc2x1ZyAke3VybH1gKTtcblxuICAgIC8vIFVzZSBHZW1pbmkgMyB3aXRoIFNlYXJjaCBHcm91bmRpbmcgdG8gZmluZCBhY3R1YWwgYmxvZyBwb3N0cyBhdCB0aGUgcHJvdmlkZWQgVVJMXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhaS5tb2RlbHMuZ2VuZXJhdGVDb250ZW50KHtcbiAgICAgIG1vZGVsOiBcImdlbWluaS0zLWZsYXNoLXByZXZpZXdcIixcbiAgICAgIGNvbnRlbnRzOiBgSWRlbnRpZnkgdGhlIGxhdGVzdCA1IGJsb2cgcG9zdHMgc3BlY2lmaWNhbGx5IGZyb20gdGhlIHNpdGUgb3Igc2VjdGlvbjogJHt1cmx9LiBcbiAgICAgIEZvciBlYWNoIHBvc3QsIEkgbmVlZDpcbiAgICAgIDEuIFB1YmxpY2F0aW9uIERhdGVcbiAgICAgIDIuIEF1dGhvciBOYW1lXG4gICAgICAzLiBGdWxsIFRpdGxlXG4gICAgICA0LiBEaXJlY3QgVVJMXG4gICAgICBcbiAgICAgIFZlcmlmeSB0aGVzZSBhcmUgcmVhbCwgZXhpc3RpbmcgcG9zdHMgZnJvbSB0aGUgbGFzdCAxMiBtb250aHMuYCxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICB0b29sczogW3sgZ29vZ2xlU2VhcmNoOiB7fSB9XSxcbiAgICAgICAgcmVzcG9uc2VNaW1lVHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIHJlc3BvbnNlU2NoZW1hOiB7XG4gICAgICAgICAgdHlwZTogVHlwZS5BUlJBWSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogVHlwZS5PQkpFQ1QsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGRhdGU6IHsgdHlwZTogVHlwZS5TVFJJTkcgfSxcbiAgICAgICAgICAgICAgYXV0aG9yOiB7IHR5cGU6IFR5cGUuU1RSSU5HIH0sXG4gICAgICAgICAgICAgIHRpdGxlOiB7IHR5cGU6IFR5cGUuU1RSSU5HIH0sXG4gICAgICAgICAgICAgIHVybDogeyB0eXBlOiBUeXBlLlNUUklORyB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IFtcImRhdGVcIiwgXCJhdXRob3JcIiwgXCJ0aXRsZVwiLCBcInVybFwiXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdGV4dCA9IHJlc3BvbnNlLnRleHQgfHwgXCJbXVwiO1xuICAgIGNvbnN0IGV4dHJhY3RlZCA9IEpTT04ucGFyc2UodGV4dCk7XG4gICAgXG4gICAgY29uc3QgaXRlbXMgPSBleHRyYWN0ZWQubWFwKChwb3N0OiBhbnksIGlkeDogbnVtYmVyKSA9PiAoe1xuICAgICAgaWQ6IGBzY3JhcGUtJHtEYXRlLm5vdygpfS0ke2lkeH1gLFxuICAgICAgcHJvamVjdElkLFxuICAgICAgZGF0ZTogcG9zdC5kYXRlLFxuICAgICAgcGxhdGZvcm06ICdCTE9HJyxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGF1dGhvcjogcG9zdC5hdXRob3IsXG4gICAgICBkZXNjcmlwdGlvbjogcG9zdC50aXRsZSxcbiAgICAgIHVybDogcG9zdC51cmwsXG4gICAgICBpbXByZXNzaW9uczogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNTAwMCkgKyAxMDAsXG4gICAgICB2aWV3czogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjAwMCkgKyA1MCxcbiAgICAgIGVuZ2FnZW1lbnQ6IE51bWJlcigoTWF0aC5yYW5kb20oKSAqIDUpLnRvRml4ZWQoMikpXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGl0ZW1zKTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJTY3JhcGUgZmFpbHVyZTpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBlcnJvci5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGV4dHJhY3QgY29udGVudFwiIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJHb29nbGVHZW5BSSIsIlR5cGUiLCJhaSIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJBUElfS0VZIiwiUE9TVCIsInJlcXVlc3QiLCJ1cmwiLCJwcm9qZWN0SWQiLCJqc29uIiwiY29uc29sZSIsImxvZyIsInJlc3BvbnNlIiwibW9kZWxzIiwiZ2VuZXJhdGVDb250ZW50IiwibW9kZWwiLCJjb250ZW50cyIsImNvbmZpZyIsInRvb2xzIiwiZ29vZ2xlU2VhcmNoIiwicmVzcG9uc2VNaW1lVHlwZSIsInJlc3BvbnNlU2NoZW1hIiwidHlwZSIsIkFSUkFZIiwiaXRlbXMiLCJPQkpFQ1QiLCJwcm9wZXJ0aWVzIiwiZGF0ZSIsIlNUUklORyIsImF1dGhvciIsInRpdGxlIiwicmVxdWlyZWQiLCJ0ZXh0IiwiZXh0cmFjdGVkIiwiSlNPTiIsInBhcnNlIiwibWFwIiwicG9zdCIsImlkeCIsImlkIiwiRGF0ZSIsIm5vdyIsInBsYXRmb3JtIiwiZGVzY3JpcHRpb24iLCJpbXByZXNzaW9ucyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInZpZXdzIiwiZW5nYWdlbWVudCIsIk51bWJlciIsInRvRml4ZWQiLCJlcnJvciIsIm1lc3NhZ2UiLCJzdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/scrape/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fscrape%2Froute&page=%2Fapi%2Fscrape%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fscrape%2Froute.ts&appDir=%2FUsers%2Fanimeshpathak%2FDRelBit%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fanimeshpathak%2FDRelBit&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fscrape%2Froute&page=%2Fapi%2Fscrape%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fscrape%2Froute.ts&appDir=%2FUsers%2Fanimeshpathak%2FDRelBit%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fanimeshpathak%2FDRelBit&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handler: () => (/* binding */ handler),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/request-meta */ \"(rsc)/./node_modules/next/dist/server/request-meta.js\");\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dist/server/lib/trace/tracer */ \"(rsc)/./node_modules/next/dist/server/lib/trace/tracer.js\");\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/shared/lib/router/utils/app-paths */ \"next/dist/shared/lib/router/utils/app-paths\");\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/base-http/node */ \"(rsc)/./node_modules/next/dist/server/base-http/node.js\");\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/dist/server/web/spec-extension/adapters/next-request */ \"(rsc)/./node_modules/next/dist/server/web/spec-extension/adapters/next-request.js\");\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/dist/server/lib/trace/constants */ \"(rsc)/./node_modules/next/dist/server/lib/trace/constants.js\");\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/dist/server/instrumentation/utils */ \"(rsc)/./node_modules/next/dist/server/instrumentation/utils.js\");\n/* harmony import */ var next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! next/dist/server/send-response */ \"(rsc)/./node_modules/next/dist/server/send-response.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(rsc)/./node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/dist/server/lib/cache-control */ \"(rsc)/./node_modules/next/dist/server/lib/cache-control.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! next/dist/lib/constants */ \"(rsc)/./node_modules/next/dist/lib/constants.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! next/dist/shared/lib/no-fallback-error.external */ \"next/dist/shared/lib/no-fallback-error.external\");\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! next/dist/server/response-cache */ \"(rsc)/./node_modules/next/dist/server/response-cache/index.js\");\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var _Users_animeshpathak_DRelBit_app_api_scrape_route_ts__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app/api/scrape/route.ts */ \"(rsc)/./app/api/scrape/route.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/scrape/route\",\n        pathname: \"/api/scrape\",\n        filename: \"route\",\n        bundlePath: \"app/api/scrape/route\"\n    },\n    distDir: \".next\" || 0,\n    relativeProjectDir:  false || '',\n    resolvedPagePath: \"/Users/animeshpathak/DRelBit/app/api/scrape/route.ts\",\n    nextConfigOutput,\n    userland: _Users_animeshpathak_DRelBit_app_api_scrape_route_ts__WEBPACK_IMPORTED_MODULE_16__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\nasync function handler(req, res, ctx) {\n    var _nextConfig_experimental;\n    let srcPage = \"/api/scrape/route\";\n    // turbopack doesn't normalize `/index` in the page name\n    // so we need to to process dynamic routes properly\n    // TODO: fix turbopack providing differing value from webpack\n    if (false) {} else if (srcPage === '/index') {\n        // we always normalize /index specifically\n        srcPage = '/';\n    }\n    const multiZoneDraftMode = false;\n    const prepareResult = await routeModule.prepare(req, res, {\n        srcPage,\n        multiZoneDraftMode\n    });\n    if (!prepareResult) {\n        res.statusCode = 400;\n        res.end('Bad Request');\n        ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, Promise.resolve());\n        return null;\n    }\n    const { buildId, params, nextConfig, isDraftMode, prerenderManifest, routerServerContext, isOnDemandRevalidate, revalidateOnlyGenerated, resolvedPathname } = prepareResult;\n    const normalizedSrcPage = (0,next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__.normalizeAppPath)(srcPage);\n    let isIsr = Boolean(prerenderManifest.dynamicRoutes[normalizedSrcPage] || prerenderManifest.routes[resolvedPathname]);\n    if (isIsr && !isDraftMode) {\n        const isPrerendered = Boolean(prerenderManifest.routes[resolvedPathname]);\n        const prerenderInfo = prerenderManifest.dynamicRoutes[normalizedSrcPage];\n        if (prerenderInfo) {\n            if (prerenderInfo.fallback === false && !isPrerendered) {\n                throw new next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError();\n            }\n        }\n    }\n    let cacheKey = null;\n    if (isIsr && !routeModule.isDev && !isDraftMode) {\n        cacheKey = resolvedPathname;\n        // ensure /index and / is normalized to one key\n        cacheKey = cacheKey === '/index' ? '/' : cacheKey;\n    }\n    const supportsDynamicResponse = // If we're in development, we always support dynamic HTML\n    routeModule.isDev === true || // If this is not SSG or does not have static paths, then it supports\n    // dynamic HTML.\n    !isIsr;\n    // This is a revalidation request if the request is for a static\n    // page and it is not being resumed from a postponed render and\n    // it is not a dynamic RSC request then it is a revalidation\n    // request.\n    const isRevalidate = isIsr && !supportsDynamicResponse;\n    const method = req.method || 'GET';\n    const tracer = (0,next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.getTracer)();\n    const activeSpan = tracer.getActiveScopeSpan();\n    const context = {\n        params,\n        prerenderManifest,\n        renderOpts: {\n            experimental: {\n                cacheComponents: Boolean(nextConfig.experimental.cacheComponents),\n                authInterrupts: Boolean(nextConfig.experimental.authInterrupts)\n            },\n            supportsDynamicResponse,\n            incrementalCache: (0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'incrementalCache'),\n            cacheLifeProfiles: (_nextConfig_experimental = nextConfig.experimental) == null ? void 0 : _nextConfig_experimental.cacheLife,\n            isRevalidate,\n            waitUntil: ctx.waitUntil,\n            onClose: (cb)=>{\n                res.on('close', cb);\n            },\n            onAfterTaskError: undefined,\n            onInstrumentationRequestError: (error, _request, errorContext)=>routeModule.onRequestError(req, error, errorContext, routerServerContext)\n        },\n        sharedContext: {\n            buildId\n        }\n    };\n    const nodeNextReq = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextRequest(req);\n    const nodeNextRes = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextResponse(res);\n    const nextReq = next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.NextRequestAdapter.fromNodeNextRequest(nodeNextReq, (0,next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.signalFromNodeResponse)(res));\n    try {\n        const invokeRouteModule = async (span)=>{\n            return routeModule.handle(nextReq, context).finally(()=>{\n                if (!span) return;\n                span.setAttributes({\n                    'http.status_code': res.statusCode,\n                    'next.rsc': false\n                });\n                const rootSpanAttributes = tracer.getRootSpanAttributes();\n                // We were unable to get attributes, probably OTEL is not enabled\n                if (!rootSpanAttributes) {\n                    return;\n                }\n                if (rootSpanAttributes.get('next.span_type') !== next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest) {\n                    console.warn(`Unexpected root span type '${rootSpanAttributes.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`);\n                    return;\n                }\n                const route = rootSpanAttributes.get('next.route');\n                if (route) {\n                    const name = `${method} ${route}`;\n                    span.setAttributes({\n                        'next.route': route,\n                        'http.route': route,\n                        'next.span_name': name\n                    });\n                    span.updateName(name);\n                } else {\n                    span.updateName(`${method} ${req.url}`);\n                }\n            });\n        };\n        const handleResponse = async (currentSpan)=>{\n            var _cacheEntry_value;\n            const responseGenerator = async ({ previousCacheEntry })=>{\n                try {\n                    if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isOnDemandRevalidate && revalidateOnlyGenerated && !previousCacheEntry) {\n                        res.statusCode = 404;\n                        // on-demand revalidate always sets this header\n                        res.setHeader('x-nextjs-cache', 'REVALIDATED');\n                        res.end('This page could not be found');\n                        return null;\n                    }\n                    const response = await invokeRouteModule(currentSpan);\n                    req.fetchMetrics = context.renderOpts.fetchMetrics;\n                    let pendingWaitUntil = context.renderOpts.pendingWaitUntil;\n                    // Attempt using provided waitUntil if available\n                    // if it's not we fallback to sendResponse's handling\n                    if (pendingWaitUntil) {\n                        if (ctx.waitUntil) {\n                            ctx.waitUntil(pendingWaitUntil);\n                            pendingWaitUntil = undefined;\n                        }\n                    }\n                    const cacheTags = context.renderOpts.collectedTags;\n                    // If the request is for a static response, we can cache it so long\n                    // as it's not edge.\n                    if (isIsr) {\n                        const blob = await response.blob();\n                        // Copy the headers from the response.\n                        const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.toNodeOutgoingHttpHeaders)(response.headers);\n                        if (cacheTags) {\n                            headers[next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER] = cacheTags;\n                        }\n                        if (!headers['content-type'] && blob.type) {\n                            headers['content-type'] = blob.type;\n                        }\n                        const revalidate = typeof context.renderOpts.collectedRevalidate === 'undefined' || context.renderOpts.collectedRevalidate >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? false : context.renderOpts.collectedRevalidate;\n                        const expire = typeof context.renderOpts.collectedExpire === 'undefined' || context.renderOpts.collectedExpire >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? undefined : context.renderOpts.collectedExpire;\n                        // Create the cache entry for the response.\n                        const cacheEntry = {\n                            value: {\n                                kind: next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE,\n                                status: response.status,\n                                body: Buffer.from(await blob.arrayBuffer()),\n                                headers\n                            },\n                            cacheControl: {\n                                revalidate,\n                                expire\n                            }\n                        };\n                        return cacheEntry;\n                    } else {\n                        // send response without caching if not ISR\n                        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, response, context.renderOpts.pendingWaitUntil);\n                        return null;\n                    }\n                } catch (err) {\n                    // if this is a background revalidate we need to report\n                    // the request error here as it won't be bubbled\n                    if (previousCacheEntry == null ? void 0 : previousCacheEntry.isStale) {\n                        await routeModule.onRequestError(req, err, {\n                            routerKind: 'App Router',\n                            routePath: srcPage,\n                            routeType: 'route',\n                            revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                                isRevalidate,\n                                isOnDemandRevalidate\n                            })\n                        }, routerServerContext);\n                    }\n                    throw err;\n                }\n            };\n            const cacheEntry = await routeModule.handleResponse({\n                req,\n                nextConfig,\n                cacheKey,\n                routeKind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n                isFallback: false,\n                prerenderManifest,\n                isRoutePPREnabled: false,\n                isOnDemandRevalidate,\n                revalidateOnlyGenerated,\n                responseGenerator,\n                waitUntil: ctx.waitUntil\n            });\n            // we don't create a cacheEntry for ISR\n            if (!isIsr) {\n                return null;\n            }\n            if ((cacheEntry == null ? void 0 : (_cacheEntry_value = cacheEntry.value) == null ? void 0 : _cacheEntry_value.kind) !== next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE) {\n                var _cacheEntry_value1;\n                throw Object.defineProperty(new Error(`Invariant: app-route received invalid cache entry ${cacheEntry == null ? void 0 : (_cacheEntry_value1 = cacheEntry.value) == null ? void 0 : _cacheEntry_value1.kind}`), \"__NEXT_ERROR_CODE\", {\n                    value: \"E701\",\n                    enumerable: false,\n                    configurable: true\n                });\n            }\n            if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode')) {\n                res.setHeader('x-nextjs-cache', isOnDemandRevalidate ? 'REVALIDATED' : cacheEntry.isMiss ? 'MISS' : cacheEntry.isStale ? 'STALE' : 'HIT');\n            }\n            // Draft mode should never be cached\n            if (isDraftMode) {\n                res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');\n            }\n            const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.fromNodeOutgoingHttpHeaders)(cacheEntry.value.headers);\n            if (!((0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isIsr)) {\n                headers.delete(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER);\n            }\n            // If cache control is already set on the response we don't\n            // override it to allow users to customize it via next.config\n            if (cacheEntry.cacheControl && !res.getHeader('Cache-Control') && !headers.get('Cache-Control')) {\n                headers.set('Cache-Control', (0,next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__.getCacheControlHeader)(cacheEntry.cacheControl));\n            }\n            await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(cacheEntry.value.body, {\n                headers,\n                status: cacheEntry.value.status || 200\n            }));\n            return null;\n        };\n        // TODO: activeSpan code path is for when wrapped by\n        // next-server can be removed when this is no longer used\n        if (activeSpan) {\n            await handleResponse(activeSpan);\n        } else {\n            await tracer.withPropagatedContext(req.headers, ()=>tracer.trace(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest, {\n                    spanName: `${method} ${req.url}`,\n                    kind: next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.SpanKind.SERVER,\n                    attributes: {\n                        'http.method': method,\n                        'http.target': req.url\n                    }\n                }, handleResponse));\n        }\n    } catch (err) {\n        if (!(err instanceof next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError)) {\n            await routeModule.onRequestError(req, err, {\n                routerKind: 'App Router',\n                routePath: normalizedSrcPage,\n                routeType: 'route',\n                revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                    isRevalidate,\n                    isOnDemandRevalidate\n                })\n            });\n        }\n        // rethrow so that we can handle serving error page\n        // If this is during static generation, throw the error again.\n        if (isIsr) throw err;\n        // Otherwise, send a 500 response.\n        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(null, {\n            status: 500\n        }));\n        return null;\n    }\n}\n\n//# sourceMappingURL=app-route.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzY3JhcGUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNjcmFwZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNjcmFwZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFuaW1lc2hwYXRoYWslMkZEUmVsQml0JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmFuaW1lc2hwYXRoYWslMkZEUmVsQml0JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEJmlzR2xvYmFsTm90Rm91bmRFbmFibGVkPSEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDZDtBQUNTO0FBQ087QUFDSztBQUNtQztBQUNqRDtBQUNPO0FBQ2Y7QUFDc0M7QUFDekI7QUFDTTtBQUNDO0FBQ2hCO0FBQ2U7QUFDakY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsYUFBYSxPQUFvQyxJQUFJLENBQUU7QUFDdkQsd0JBQXdCLE1BQXVDO0FBQy9EO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGO0FBQ25GO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsS0FBcUIsRUFBRSxFQUUxQixDQUFDO0FBQ047QUFDQTtBQUNBO0FBQ0EsK0JBQStCLEtBQXdDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9KQUFvSjtBQUNoSyw4QkFBOEIsNkZBQWdCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw2RkFBZTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw0RUFBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsOEJBQThCLDZFQUFjO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw0RUFBZTtBQUMzQyw0QkFBNEIsNkVBQWdCO0FBQzVDLG9CQUFvQix5R0FBa0Isa0NBQWtDLGlIQUFzQjtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLGdGQUFjO0FBQy9FLCtEQUErRCx5Q0FBeUM7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUSxFQUFFLE1BQU07QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxrQkFBa0I7QUFDbEIsdUNBQXVDLFFBQVEsRUFBRSxRQUFRO0FBQ3pEO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxvQkFBb0I7QUFDbkU7QUFDQSx5QkFBeUIsNkVBQWM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxzRkFBeUI7QUFDakU7QUFDQSxvQ0FBb0MsNEVBQXNCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0pBQXNKLG9FQUFjO0FBQ3BLLDBJQUEwSSxvRUFBYztBQUN4SjtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsNkVBQWU7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBLDhCQUE4Qiw2RUFBWTtBQUMxQztBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLDJGQUFtQjtBQUNqRTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGtFQUFTO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUlBQXFJLDZFQUFlO0FBQ3BKO0FBQ0EsMkdBQTJHLGlIQUFpSDtBQUM1TjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxpQkFBaUIsNkVBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdGQUEyQjtBQUN2RCxrQkFBa0IsNkVBQWM7QUFDaEMsK0JBQStCLDRFQUFzQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QywwRkFBcUI7QUFDbEU7QUFDQSxrQkFBa0IsNkVBQVk7QUFDOUI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsNkVBQTZFLGdGQUFjO0FBQzNGLGlDQUFpQyxRQUFRLEVBQUUsUUFBUTtBQUNuRCwwQkFBMEIsdUVBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxNQUFNO0FBQ04sNkJBQTZCLDZGQUFlO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDJGQUFtQjtBQUNyRDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyw2RUFBWTtBQUMxQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgeyBnZXRSZXF1ZXN0TWV0YSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JlcXVlc3QtbWV0YVwiO1xuaW1wb3J0IHsgZ2V0VHJhY2VyLCBTcGFuS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi90cmFjZS90cmFjZXJcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZUFwcFBhdGggfSBmcm9tIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL2FwcC1wYXRoc1wiO1xuaW1wb3J0IHsgTm9kZU5leHRSZXF1ZXN0LCBOb2RlTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvYmFzZS1odHRwL25vZGVcIjtcbmltcG9ydCB7IE5leHRSZXF1ZXN0QWRhcHRlciwgc2lnbmFsRnJvbU5vZGVSZXNwb25zZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3dlYi9zcGVjLWV4dGVuc2lvbi9hZGFwdGVycy9uZXh0LXJlcXVlc3RcIjtcbmltcG9ydCB7IEJhc2VTZXJ2ZXJTcGFuIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3RyYWNlL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0UmV2YWxpZGF0ZVJlYXNvbiB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2luc3RydW1lbnRhdGlvbi91dGlsc1wiO1xuaW1wb3J0IHsgc2VuZFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvc2VuZC1yZXNwb25zZVwiO1xuaW1wb3J0IHsgZnJvbU5vZGVPdXRnb2luZ0h0dHBIZWFkZXJzLCB0b05vZGVPdXRnb2luZ0h0dHBIZWFkZXJzIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL3V0aWxzXCI7XG5pbXBvcnQgeyBnZXRDYWNoZUNvbnRyb2xIZWFkZXIgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvY2FjaGUtY29udHJvbFwiO1xuaW1wb3J0IHsgSU5GSU5JVEVfQ0FDSEUsIE5FWFRfQ0FDSEVfVEFHU19IRUFERVIgfSBmcm9tIFwibmV4dC9kaXN0L2xpYi9jb25zdGFudHNcIjtcbmltcG9ydCB7IE5vRmFsbGJhY2tFcnJvciB9IGZyb20gXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9uby1mYWxsYmFjay1lcnJvci5leHRlcm5hbFwiO1xuaW1wb3J0IHsgQ2FjaGVkUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcmVzcG9uc2UtY2FjaGVcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvYW5pbWVzaHBhdGhhay9EUmVsQml0L2FwcC9hcGkvc2NyYXBlL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9zY3JhcGUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9zY3JhcGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3NjcmFwZS9yb3V0ZVwiXG4gICAgfSxcbiAgICBkaXN0RGlyOiBwcm9jZXNzLmVudi5fX05FWFRfUkVMQVRJVkVfRElTVF9ESVIgfHwgJycsXG4gICAgcmVsYXRpdmVQcm9qZWN0RGlyOiBwcm9jZXNzLmVudi5fX05FWFRfUkVMQVRJVkVfUFJPSkVDVF9ESVIgfHwgJycsXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvYW5pbWVzaHBhdGhhay9EUmVsQml0L2FwcC9hcGkvc2NyYXBlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMsIGN0eCkge1xuICAgIHZhciBfbmV4dENvbmZpZ19leHBlcmltZW50YWw7XG4gICAgbGV0IHNyY1BhZ2UgPSBcIi9hcGkvc2NyYXBlL3JvdXRlXCI7XG4gICAgLy8gdHVyYm9wYWNrIGRvZXNuJ3Qgbm9ybWFsaXplIGAvaW5kZXhgIGluIHRoZSBwYWdlIG5hbWVcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHRvIHByb2Nlc3MgZHluYW1pYyByb3V0ZXMgcHJvcGVybHlcbiAgICAvLyBUT0RPOiBmaXggdHVyYm9wYWNrIHByb3ZpZGluZyBkaWZmZXJpbmcgdmFsdWUgZnJvbSB3ZWJwYWNrXG4gICAgaWYgKHByb2Nlc3MuZW52LlRVUkJPUEFDSykge1xuICAgICAgICBzcmNQYWdlID0gc3JjUGFnZS5yZXBsYWNlKC9cXC9pbmRleCQvLCAnJykgfHwgJy8nO1xuICAgIH0gZWxzZSBpZiAoc3JjUGFnZSA9PT0gJy9pbmRleCcpIHtcbiAgICAgICAgLy8gd2UgYWx3YXlzIG5vcm1hbGl6ZSAvaW5kZXggc3BlY2lmaWNhbGx5XG4gICAgICAgIHNyY1BhZ2UgPSAnLyc7XG4gICAgfVxuICAgIGNvbnN0IG11bHRpWm9uZURyYWZ0TW9kZSA9IHByb2Nlc3MuZW52Ll9fTkVYVF9NVUxUSV9aT05FX0RSQUZUX01PREU7XG4gICAgY29uc3QgcHJlcGFyZVJlc3VsdCA9IGF3YWl0IHJvdXRlTW9kdWxlLnByZXBhcmUocmVxLCByZXMsIHtcbiAgICAgICAgc3JjUGFnZSxcbiAgICAgICAgbXVsdGlab25lRHJhZnRNb2RlXG4gICAgfSk7XG4gICAgaWYgKCFwcmVwYXJlUmVzdWx0KSB7XG4gICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDAwO1xuICAgICAgICByZXMuZW5kKCdCYWQgUmVxdWVzdCcpO1xuICAgICAgICBjdHgud2FpdFVudGlsID09IG51bGwgPyB2b2lkIDAgOiBjdHgud2FpdFVudGlsLmNhbGwoY3R4LCBQcm9taXNlLnJlc29sdmUoKSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7IGJ1aWxkSWQsIHBhcmFtcywgbmV4dENvbmZpZywgaXNEcmFmdE1vZGUsIHByZXJlbmRlck1hbmlmZXN0LCByb3V0ZXJTZXJ2ZXJDb250ZXh0LCBpc09uRGVtYW5kUmV2YWxpZGF0ZSwgcmV2YWxpZGF0ZU9ubHlHZW5lcmF0ZWQsIHJlc29sdmVkUGF0aG5hbWUgfSA9IHByZXBhcmVSZXN1bHQ7XG4gICAgY29uc3Qgbm9ybWFsaXplZFNyY1BhZ2UgPSBub3JtYWxpemVBcHBQYXRoKHNyY1BhZ2UpO1xuICAgIGxldCBpc0lzciA9IEJvb2xlYW4ocHJlcmVuZGVyTWFuaWZlc3QuZHluYW1pY1JvdXRlc1tub3JtYWxpemVkU3JjUGFnZV0gfHwgcHJlcmVuZGVyTWFuaWZlc3Qucm91dGVzW3Jlc29sdmVkUGF0aG5hbWVdKTtcbiAgICBpZiAoaXNJc3IgJiYgIWlzRHJhZnRNb2RlKSB7XG4gICAgICAgIGNvbnN0IGlzUHJlcmVuZGVyZWQgPSBCb29sZWFuKHByZXJlbmRlck1hbmlmZXN0LnJvdXRlc1tyZXNvbHZlZFBhdGhuYW1lXSk7XG4gICAgICAgIGNvbnN0IHByZXJlbmRlckluZm8gPSBwcmVyZW5kZXJNYW5pZmVzdC5keW5hbWljUm91dGVzW25vcm1hbGl6ZWRTcmNQYWdlXTtcbiAgICAgICAgaWYgKHByZXJlbmRlckluZm8pIHtcbiAgICAgICAgICAgIGlmIChwcmVyZW5kZXJJbmZvLmZhbGxiYWNrID09PSBmYWxzZSAmJiAhaXNQcmVyZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb0ZhbGxiYWNrRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgY2FjaGVLZXkgPSBudWxsO1xuICAgIGlmIChpc0lzciAmJiAhcm91dGVNb2R1bGUuaXNEZXYgJiYgIWlzRHJhZnRNb2RlKSB7XG4gICAgICAgIGNhY2hlS2V5ID0gcmVzb2x2ZWRQYXRobmFtZTtcbiAgICAgICAgLy8gZW5zdXJlIC9pbmRleCBhbmQgLyBpcyBub3JtYWxpemVkIHRvIG9uZSBrZXlcbiAgICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleSA9PT0gJy9pbmRleCcgPyAnLycgOiBjYWNoZUtleTtcbiAgICB9XG4gICAgY29uc3Qgc3VwcG9ydHNEeW5hbWljUmVzcG9uc2UgPSAvLyBJZiB3ZSdyZSBpbiBkZXZlbG9wbWVudCwgd2UgYWx3YXlzIHN1cHBvcnQgZHluYW1pYyBIVE1MXG4gICAgcm91dGVNb2R1bGUuaXNEZXYgPT09IHRydWUgfHwgLy8gSWYgdGhpcyBpcyBub3QgU1NHIG9yIGRvZXMgbm90IGhhdmUgc3RhdGljIHBhdGhzLCB0aGVuIGl0IHN1cHBvcnRzXG4gICAgLy8gZHluYW1pYyBIVE1MLlxuICAgICFpc0lzcjtcbiAgICAvLyBUaGlzIGlzIGEgcmV2YWxpZGF0aW9uIHJlcXVlc3QgaWYgdGhlIHJlcXVlc3QgaXMgZm9yIGEgc3RhdGljXG4gICAgLy8gcGFnZSBhbmQgaXQgaXMgbm90IGJlaW5nIHJlc3VtZWQgZnJvbSBhIHBvc3Rwb25lZCByZW5kZXIgYW5kXG4gICAgLy8gaXQgaXMgbm90IGEgZHluYW1pYyBSU0MgcmVxdWVzdCB0aGVuIGl0IGlzIGEgcmV2YWxpZGF0aW9uXG4gICAgLy8gcmVxdWVzdC5cbiAgICBjb25zdCBpc1JldmFsaWRhdGUgPSBpc0lzciAmJiAhc3VwcG9ydHNEeW5hbWljUmVzcG9uc2U7XG4gICAgY29uc3QgbWV0aG9kID0gcmVxLm1ldGhvZCB8fCAnR0VUJztcbiAgICBjb25zdCB0cmFjZXIgPSBnZXRUcmFjZXIoKTtcbiAgICBjb25zdCBhY3RpdmVTcGFuID0gdHJhY2VyLmdldEFjdGl2ZVNjb3BlU3BhbigpO1xuICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICAgIHBhcmFtcyxcbiAgICAgICAgcHJlcmVuZGVyTWFuaWZlc3QsXG4gICAgICAgIHJlbmRlck9wdHM6IHtcbiAgICAgICAgICAgIGV4cGVyaW1lbnRhbDoge1xuICAgICAgICAgICAgICAgIGNhY2hlQ29tcG9uZW50czogQm9vbGVhbihuZXh0Q29uZmlnLmV4cGVyaW1lbnRhbC5jYWNoZUNvbXBvbmVudHMpLFxuICAgICAgICAgICAgICAgIGF1dGhJbnRlcnJ1cHRzOiBCb29sZWFuKG5leHRDb25maWcuZXhwZXJpbWVudGFsLmF1dGhJbnRlcnJ1cHRzKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1cHBvcnRzRHluYW1pY1Jlc3BvbnNlLFxuICAgICAgICAgICAgaW5jcmVtZW50YWxDYWNoZTogZ2V0UmVxdWVzdE1ldGEocmVxLCAnaW5jcmVtZW50YWxDYWNoZScpLFxuICAgICAgICAgICAgY2FjaGVMaWZlUHJvZmlsZXM6IChfbmV4dENvbmZpZ19leHBlcmltZW50YWwgPSBuZXh0Q29uZmlnLmV4cGVyaW1lbnRhbCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9uZXh0Q29uZmlnX2V4cGVyaW1lbnRhbC5jYWNoZUxpZmUsXG4gICAgICAgICAgICBpc1JldmFsaWRhdGUsXG4gICAgICAgICAgICB3YWl0VW50aWw6IGN0eC53YWl0VW50aWwsXG4gICAgICAgICAgICBvbkNsb3NlOiAoY2IpPT57XG4gICAgICAgICAgICAgICAgcmVzLm9uKCdjbG9zZScsIGNiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkFmdGVyVGFza0Vycm9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBvbkluc3RydW1lbnRhdGlvblJlcXVlc3RFcnJvcjogKGVycm9yLCBfcmVxdWVzdCwgZXJyb3JDb250ZXh0KT0+cm91dGVNb2R1bGUub25SZXF1ZXN0RXJyb3IocmVxLCBlcnJvciwgZXJyb3JDb250ZXh0LCByb3V0ZXJTZXJ2ZXJDb250ZXh0KVxuICAgICAgICB9LFxuICAgICAgICBzaGFyZWRDb250ZXh0OiB7XG4gICAgICAgICAgICBidWlsZElkXG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG5vZGVOZXh0UmVxID0gbmV3IE5vZGVOZXh0UmVxdWVzdChyZXEpO1xuICAgIGNvbnN0IG5vZGVOZXh0UmVzID0gbmV3IE5vZGVOZXh0UmVzcG9uc2UocmVzKTtcbiAgICBjb25zdCBuZXh0UmVxID0gTmV4dFJlcXVlc3RBZGFwdGVyLmZyb21Ob2RlTmV4dFJlcXVlc3Qobm9kZU5leHRSZXEsIHNpZ25hbEZyb21Ob2RlUmVzcG9uc2UocmVzKSk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW52b2tlUm91dGVNb2R1bGUgPSBhc3luYyAoc3Bhbik9PntcbiAgICAgICAgICAgIHJldHVybiByb3V0ZU1vZHVsZS5oYW5kbGUobmV4dFJlcSwgY29udGV4dCkuZmluYWxseSgoKT0+e1xuICAgICAgICAgICAgICAgIGlmICghc3BhbikgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHNwYW4uc2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgICAgICAgICdodHRwLnN0YXR1c19jb2RlJzogcmVzLnN0YXR1c0NvZGUsXG4gICAgICAgICAgICAgICAgICAgICduZXh0LnJzYyc6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm9vdFNwYW5BdHRyaWJ1dGVzID0gdHJhY2VyLmdldFJvb3RTcGFuQXR0cmlidXRlcygpO1xuICAgICAgICAgICAgICAgIC8vIFdlIHdlcmUgdW5hYmxlIHRvIGdldCBhdHRyaWJ1dGVzLCBwcm9iYWJseSBPVEVMIGlzIG5vdCBlbmFibGVkXG4gICAgICAgICAgICAgICAgaWYgKCFyb290U3BhbkF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocm9vdFNwYW5BdHRyaWJ1dGVzLmdldCgnbmV4dC5zcGFuX3R5cGUnKSAhPT0gQmFzZVNlcnZlclNwYW4uaGFuZGxlUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVuZXhwZWN0ZWQgcm9vdCBzcGFuIHR5cGUgJyR7cm9vdFNwYW5BdHRyaWJ1dGVzLmdldCgnbmV4dC5zcGFuX3R5cGUnKX0nLiBQbGVhc2UgcmVwb3J0IHRoaXMgTmV4dC5qcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vdmVyY2VsL25leHQuanNgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByb3V0ZSA9IHJvb3RTcGFuQXR0cmlidXRlcy5nZXQoJ25leHQucm91dGUnKTtcbiAgICAgICAgICAgICAgICBpZiAocm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGAke21ldGhvZH0gJHtyb3V0ZX1gO1xuICAgICAgICAgICAgICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ25leHQucm91dGUnOiByb3V0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdodHRwLnJvdXRlJzogcm91dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmV4dC5zcGFuX25hbWUnOiBuYW1lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzcGFuLnVwZGF0ZU5hbWUobmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi51cGRhdGVOYW1lKGAke21ldGhvZH0gJHtyZXEudXJsfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBoYW5kbGVSZXNwb25zZSA9IGFzeW5jIChjdXJyZW50U3Bhbik9PntcbiAgICAgICAgICAgIHZhciBfY2FjaGVFbnRyeV92YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlR2VuZXJhdG9yID0gYXN5bmMgKHsgcHJldmlvdXNDYWNoZUVudHJ5IH0pPT57XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFnZXRSZXF1ZXN0TWV0YShyZXEsICdtaW5pbWFsTW9kZScpICYmIGlzT25EZW1hbmRSZXZhbGlkYXRlICYmIHJldmFsaWRhdGVPbmx5R2VuZXJhdGVkICYmICFwcmV2aW91c0NhY2hlRW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNDA0O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb24tZGVtYW5kIHJldmFsaWRhdGUgYWx3YXlzIHNldHMgdGhpcyBoZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ3gtbmV4dGpzLWNhY2hlJywgJ1JFVkFMSURBVEVEJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCdUaGlzIHBhZ2UgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGludm9rZVJvdXRlTW9kdWxlKGN1cnJlbnRTcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgcmVxLmZldGNoTWV0cmljcyA9IGNvbnRleHQucmVuZGVyT3B0cy5mZXRjaE1ldHJpY3M7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwZW5kaW5nV2FpdFVudGlsID0gY29udGV4dC5yZW5kZXJPcHRzLnBlbmRpbmdXYWl0VW50aWw7XG4gICAgICAgICAgICAgICAgICAgIC8vIEF0dGVtcHQgdXNpbmcgcHJvdmlkZWQgd2FpdFVudGlsIGlmIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIG5vdCB3ZSBmYWxsYmFjayB0byBzZW5kUmVzcG9uc2UncyBoYW5kbGluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAocGVuZGluZ1dhaXRVbnRpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN0eC53YWl0VW50aWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHgud2FpdFVudGlsKHBlbmRpbmdXYWl0VW50aWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlbmRpbmdXYWl0VW50aWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FjaGVUYWdzID0gY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZFRhZ3M7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXF1ZXN0IGlzIGZvciBhIHN0YXRpYyByZXNwb25zZSwgd2UgY2FuIGNhY2hlIGl0IHNvIGxvbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gYXMgaXQncyBub3QgZWRnZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSXNyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gYXdhaXQgcmVzcG9uc2UuYmxvYigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29weSB0aGUgaGVhZGVycyBmcm9tIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB0b05vZGVPdXRnb2luZ0h0dHBIZWFkZXJzKHJlc3BvbnNlLmhlYWRlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbTkVYVF9DQUNIRV9UQUdTX0hFQURFUl0gPSBjYWNoZVRhZ3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddICYmIGJsb2IudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddID0gYmxvYi50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV2YWxpZGF0ZSA9IHR5cGVvZiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkUmV2YWxpZGF0ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZFJldmFsaWRhdGUgPj0gSU5GSU5JVEVfQ0FDSEUgPyBmYWxzZSA6IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRSZXZhbGlkYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwaXJlID0gdHlwZW9mIGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRFeHBpcmUgPT09ICd1bmRlZmluZWQnIHx8IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRFeHBpcmUgPj0gSU5GSU5JVEVfQ0FDSEUgPyB1bmRlZmluZWQgOiBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkRXhwaXJlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBjYWNoZSBlbnRyeSBmb3IgdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FjaGVFbnRyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiBDYWNoZWRSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogQnVmZmVyLmZyb20oYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVDb250cm9sOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGlyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVFbnRyeTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlbmQgcmVzcG9uc2Ugd2l0aG91dCBjYWNoaW5nIGlmIG5vdCBJU1JcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNlbmRSZXNwb25zZShub2RlTmV4dFJlcSwgbm9kZU5leHRSZXMsIHJlc3BvbnNlLCBjb250ZXh0LnJlbmRlck9wdHMucGVuZGluZ1dhaXRVbnRpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIGlzIGEgYmFja2dyb3VuZCByZXZhbGlkYXRlIHdlIG5lZWQgdG8gcmVwb3J0XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXF1ZXN0IGVycm9yIGhlcmUgYXMgaXQgd29uJ3QgYmUgYnViYmxlZFxuICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNDYWNoZUVudHJ5ID09IG51bGwgPyB2b2lkIDAgOiBwcmV2aW91c0NhY2hlRW50cnkuaXNTdGFsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcm91dGVNb2R1bGUub25SZXF1ZXN0RXJyb3IocmVxLCBlcnIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXJLaW5kOiAnQXBwIFJvdXRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVQYXRoOiBzcmNQYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlVHlwZTogJ3JvdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZhbGlkYXRlUmVhc29uOiBnZXRSZXZhbGlkYXRlUmVhc29uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNSZXZhbGlkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09uRGVtYW5kUmV2YWxpZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCByb3V0ZXJTZXJ2ZXJDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlRW50cnkgPSBhd2FpdCByb3V0ZU1vZHVsZS5oYW5kbGVSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgcmVxLFxuICAgICAgICAgICAgICAgIG5leHRDb25maWcsXG4gICAgICAgICAgICAgICAgY2FjaGVLZXksXG4gICAgICAgICAgICAgICAgcm91dGVLaW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICAgICAgICAgIGlzRmFsbGJhY2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHByZXJlbmRlck1hbmlmZXN0LFxuICAgICAgICAgICAgICAgIGlzUm91dGVQUFJFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc09uRGVtYW5kUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICByZXZhbGlkYXRlT25seUdlbmVyYXRlZCxcbiAgICAgICAgICAgICAgICByZXNwb25zZUdlbmVyYXRvcixcbiAgICAgICAgICAgICAgICB3YWl0VW50aWw6IGN0eC53YWl0VW50aWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gd2UgZG9uJ3QgY3JlYXRlIGEgY2FjaGVFbnRyeSBmb3IgSVNSXG4gICAgICAgICAgICBpZiAoIWlzSXNyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGNhY2hlRW50cnkgPT0gbnVsbCA/IHZvaWQgMCA6IChfY2FjaGVFbnRyeV92YWx1ZSA9IGNhY2hlRW50cnkudmFsdWUpID09IG51bGwgPyB2b2lkIDAgOiBfY2FjaGVFbnRyeV92YWx1ZS5raW5kKSAhPT0gQ2FjaGVkUm91dGVLaW5kLkFQUF9ST1VURSkge1xuICAgICAgICAgICAgICAgIHZhciBfY2FjaGVFbnRyeV92YWx1ZTE7XG4gICAgICAgICAgICAgICAgdGhyb3cgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ldyBFcnJvcihgSW52YXJpYW50OiBhcHAtcm91dGUgcmVjZWl2ZWQgaW52YWxpZCBjYWNoZSBlbnRyeSAke2NhY2hlRW50cnkgPT0gbnVsbCA/IHZvaWQgMCA6IChfY2FjaGVFbnRyeV92YWx1ZTEgPSBjYWNoZUVudHJ5LnZhbHVlKSA9PSBudWxsID8gdm9pZCAwIDogX2NhY2hlRW50cnlfdmFsdWUxLmtpbmR9YCksIFwiX19ORVhUX0VSUk9SX0NPREVcIiwge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJFNzAxXCIsXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZ2V0UmVxdWVzdE1ldGEocmVxLCAnbWluaW1hbE1vZGUnKSkge1xuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ3gtbmV4dGpzLWNhY2hlJywgaXNPbkRlbWFuZFJldmFsaWRhdGUgPyAnUkVWQUxJREFURUQnIDogY2FjaGVFbnRyeS5pc01pc3MgPyAnTUlTUycgOiBjYWNoZUVudHJ5LmlzU3RhbGUgPyAnU1RBTEUnIDogJ0hJVCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRHJhZnQgbW9kZSBzaG91bGQgbmV2ZXIgYmUgY2FjaGVkXG4gICAgICAgICAgICBpZiAoaXNEcmFmdE1vZGUpIHtcbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDYWNoZS1Db250cm9sJywgJ3ByaXZhdGUsIG5vLWNhY2hlLCBuby1zdG9yZSwgbWF4LWFnZT0wLCBtdXN0LXJldmFsaWRhdGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSBmcm9tTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMoY2FjaGVFbnRyeS52YWx1ZS5oZWFkZXJzKTtcbiAgICAgICAgICAgIGlmICghKGdldFJlcXVlc3RNZXRhKHJlcSwgJ21pbmltYWxNb2RlJykgJiYgaXNJc3IpKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVycy5kZWxldGUoTkVYVF9DQUNIRV9UQUdTX0hFQURFUik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiBjYWNoZSBjb250cm9sIGlzIGFscmVhZHkgc2V0IG9uIHRoZSByZXNwb25zZSB3ZSBkb24ndFxuICAgICAgICAgICAgLy8gb3ZlcnJpZGUgaXQgdG8gYWxsb3cgdXNlcnMgdG8gY3VzdG9taXplIGl0IHZpYSBuZXh0LmNvbmZpZ1xuICAgICAgICAgICAgaWYgKGNhY2hlRW50cnkuY2FjaGVDb250cm9sICYmICFyZXMuZ2V0SGVhZGVyKCdDYWNoZS1Db250cm9sJykgJiYgIWhlYWRlcnMuZ2V0KCdDYWNoZS1Db250cm9sJykpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLnNldCgnQ2FjaGUtQ29udHJvbCcsIGdldENhY2hlQ29udHJvbEhlYWRlcihjYWNoZUVudHJ5LmNhY2hlQ29udHJvbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgc2VuZFJlc3BvbnNlKG5vZGVOZXh0UmVxLCBub2RlTmV4dFJlcywgbmV3IFJlc3BvbnNlKGNhY2hlRW50cnkudmFsdWUuYm9keSwge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBjYWNoZUVudHJ5LnZhbHVlLnN0YXR1cyB8fCAyMDBcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICAvLyBUT0RPOiBhY3RpdmVTcGFuIGNvZGUgcGF0aCBpcyBmb3Igd2hlbiB3cmFwcGVkIGJ5XG4gICAgICAgIC8vIG5leHQtc2VydmVyIGNhbiBiZSByZW1vdmVkIHdoZW4gdGhpcyBpcyBubyBsb25nZXIgdXNlZFxuICAgICAgICBpZiAoYWN0aXZlU3Bhbikge1xuICAgICAgICAgICAgYXdhaXQgaGFuZGxlUmVzcG9uc2UoYWN0aXZlU3Bhbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0cmFjZXIud2l0aFByb3BhZ2F0ZWRDb250ZXh0KHJlcS5oZWFkZXJzLCAoKT0+dHJhY2VyLnRyYWNlKEJhc2VTZXJ2ZXJTcGFuLmhhbmRsZVJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICAgICAgc3Bhbk5hbWU6IGAke21ldGhvZH0gJHtyZXEudXJsfWAsXG4gICAgICAgICAgICAgICAgICAgIGtpbmQ6IFNwYW5LaW5kLlNFUlZFUixcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2h0dHAubWV0aG9kJzogbWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2h0dHAudGFyZ2V0JzogcmVxLnVybFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgaGFuZGxlUmVzcG9uc2UpKTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoIShlcnIgaW5zdGFuY2VvZiBOb0ZhbGxiYWNrRXJyb3IpKSB7XG4gICAgICAgICAgICBhd2FpdCByb3V0ZU1vZHVsZS5vblJlcXVlc3RFcnJvcihyZXEsIGVyciwge1xuICAgICAgICAgICAgICAgIHJvdXRlcktpbmQ6ICdBcHAgUm91dGVyJyxcbiAgICAgICAgICAgICAgICByb3V0ZVBhdGg6IG5vcm1hbGl6ZWRTcmNQYWdlLFxuICAgICAgICAgICAgICAgIHJvdXRlVHlwZTogJ3JvdXRlJyxcbiAgICAgICAgICAgICAgICByZXZhbGlkYXRlUmVhc29uOiBnZXRSZXZhbGlkYXRlUmVhc29uKHtcbiAgICAgICAgICAgICAgICAgICAgaXNSZXZhbGlkYXRlLFxuICAgICAgICAgICAgICAgICAgICBpc09uRGVtYW5kUmV2YWxpZGF0ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXRocm93IHNvIHRoYXQgd2UgY2FuIGhhbmRsZSBzZXJ2aW5nIGVycm9yIHBhZ2VcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBkdXJpbmcgc3RhdGljIGdlbmVyYXRpb24sIHRocm93IHRoZSBlcnJvciBhZ2Fpbi5cbiAgICAgICAgaWYgKGlzSXNyKSB0aHJvdyBlcnI7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2VuZCBhIDUwMCByZXNwb25zZS5cbiAgICAgICAgYXdhaXQgc2VuZFJlc3BvbnNlKG5vZGVOZXh0UmVxLCBub2RlTmV4dFJlcywgbmV3IFJlc3BvbnNlKG51bGwsIHtcbiAgICAgICAgICAgIHN0YXR1czogNTAwXG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fscrape%2Froute&page=%2Fapi%2Fscrape%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fscrape%2Froute.ts&appDir=%2FUsers%2Fanimeshpathak%2FDRelBit%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fanimeshpathak%2FDRelBit&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "?32c4":
/*!****************************!*\
  !*** bufferutil (ignored) ***!
  \****************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?66e9":
/*!********************************!*\
  !*** utf-8-validate (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "next/dist/shared/lib/no-fallback-error.external":
/*!******************************************************************!*\
  !*** external "next/dist/shared/lib/no-fallback-error.external" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/no-fallback-error.external");

/***/ }),

/***/ "next/dist/shared/lib/router/utils/app-paths":
/*!**************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/app-paths" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/app-paths");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/promises":
/*!***************************************!*\
  !*** external "node:stream/promises" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/promises");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/google-auth-library","vendor-chunks/ws","vendor-chunks/gaxios","vendor-chunks/jws","vendor-chunks/json-bigint","vendor-chunks/google-logging-utils","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/p-retry","vendor-chunks/is-network-error","vendor-chunks/@google","vendor-chunks/gtoken","vendor-chunks/safe-buffer","vendor-chunks/jwa","vendor-chunks/extend","vendor-chunks/buffer-equal-constant-time","vendor-chunks/bignumber.js","vendor-chunks/base64-js"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fscrape%2Froute&page=%2Fapi%2Fscrape%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fscrape%2Froute.ts&appDir=%2FUsers%2Fanimeshpathak%2FDRelBit%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fanimeshpathak%2FDRelBit&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!")));
module.exports = __webpack_exports__;

})();