function f(t,i){return t<i?-1:t>i?1:0}async function R(t){const i=await new Promise((d,r)=>{let u=new XMLHttpRequest;u.open("GET",t),u.responseType="document",u.overrideMimeType("text/xml"),u.onloadend=()=>{u.status>=200&&u.status<300&&u.responseXML&&d(u.responseXML.documentElement),r(new Error("Failed to fetch registry."))},u.send()});return{$root:i,apis:new Map(["gl","gles1","gles2","glsc2"].map(d=>[d,{key:d,versions:[...new Set([...i.querySelectorAll(`:scope > feature[api=${d}]`)].map(r=>r.getAttribute("number")))].sort(f),profiles:[...new Set([...i.querySelectorAll(`:scope > feature[api=${d}] > *[profile]`)].map(r=>r.getAttribute("profile")))].sort(f),extensions:[...new Set([...i.querySelectorAll(":scope > extensions > extension")].filter(r=>r.getAttribute("supported").split("|").includes(d)).map(r=>r.getAttribute("name")))].sort(f)}]))}}const N=[`// NOTICE
`,`//
`,`// This work uses definitions from the OpenGL XML API Registry
`,`// <https://github.com/KhronosGroup/OpenGL-Registry>.
`,`// Copyright 2013-2020 The Khronos Group Inc.
`,`// Licensed under Apache-2.0.
`,`//
`,`// END OF NOTICE
`].join(""),B="zigglgen v0.4.1-R",F="https://falsepattern.github.io/zigglgen/";function U(t,i){const[,,d,r]=/^(.*)[ ]([0-9])\.([0-9])(?:[ ]\((.+)\))?$/.exec(i),u=!!t.extensions.size,e=[];if(e.push(N),e.push(`
`),e.push(`const std = @import("std");
`),e.push(`const root = @import("root");
`),e.push(`
`),e.push(`/// Static information about this source file and when/how it was generated.
`),e.push(`pub const about = struct {
`),e.push(`    pub const api_name = "${i}";
`),e.push(`    pub const api_version_major = ${d};
`),e.push(`    pub const api_version_minor = ${r};
`),e.push(`
`),e.push(`    pub const generated_at = "${new Date().toISOString().slice(0,19)}Z";
`),e.push(`
`),e.push(`    pub const generator_name = "${B}";
`),e.push(`    pub const generator_url = "${F}";
`),e.push(`};
`),e.push(`
`),e.push(`/// Makes the specified dispatch table current on the calling thread. This function must be called
`),e.push("/// with a valid dispatch table before calling `extensionSupported()` or any OpenGL command\n"),e.push(`/// functions on that same thread.
`),e.push(`pub fn makeDispatchTableCurrent(dispatch_table: ?*const DispatchTable) void {
`),e.push(`    DispatchTable.current = dispatch_table;
`),e.push(`}
`),e.push(`
`),e.push("/// Returns the dispatch table that is current on the calling thread, or `null` if no dispatch table\n"),e.push(`/// is current.
`),e.push(`pub fn getCurrentDispatchTable() ?*const DispatchTable {
`),e.push(`    return DispatchTable.current;
`),e.push(`}
`),e.push(`
`),u){e.push(`/// Returns a boolean value indicating whether the specified extension is currently supported.
`),e.push(`pub fn extensionSupported(comptime extension: Extension) bool {
`),e.push(`    return @field(DispatchTable.current.?, "GL_" ++ @tagName(extension));
`),e.push(`}
`),e.push(`
`),e.push(`pub const Extension = enum {
`);for(const o of t.extensions.values())e.push(`    ${y(o.name)},
`);e.push(`};
`),e.push(`
`)}e.push(`//#region Types
`);for(const o of t.types.values())e.push(`pub const ${o.name} = ${o.type};
`);e.push(`//#endregion Types
`),e.push(`
`),e.push(`//#region Constants
`);for(const o of t.constants.values())e.push(`pub const ${y(o.name)} = ${o.value};
`);e.push(`//#endregion Constants
`),e.push(`
`),e.push(`//#region Commands
`);for(const o of t.commands.values())e.push(`pub fn ${y(o.name)}(`),e.push(o.params.map(h=>`${y(h.name)}: ${h.type}`).join(", ")),e.push(`) callconv(.C) ${o.type} {
`),e.push(`    return DispatchTable.current.?.invokeIntercepted("${o.key}", .{`),o.params.length>1&&e.push(" "),e.push(o.params.map(h=>`${y(h.name)}`).join(", ")),o.params.length>1&&e.push(" "),e.push(`});
`),e.push(`}
`);e.push(`//#endregion Commands
`),e.push(`
`),e.push(`/// Holds dynamically loaded OpenGL features.
`),e.push(`///
`),e.push(`/// This struct is very large; avoid storing instances of it on the stack.
`),e.push(`pub const DispatchTable = struct {
`),e.push(`    threadlocal var current: ?*const DispatchTable = null;
`),e.push(`
`),e.push(`    //#region Fields
`);for(const o of t.extensions.values())e.push(`    ${y(o.key)}: bool,
`);for(const o of t.commands.values())e.push(`    ${y(o.key)}: `),o.optional&&e.push("?"),e.push(`*const @TypeOf(${y(o.name)}),
`);e.push(`    //#endregion Fields
`),e.push(`
`),e.push("    /// Initializes the specified dispatch table. Returns `true` if successful, `false` otherwise.\n"),e.push(`    ///
`),e.push(`    /// This function must be called successfully before passing the dispatch table to
`),e.push("    /// `makeDispatchTableCurrent()`, `invoke()`, `invokeIntercepted()` or accessing any of its\n"),e.push(`    /// fields.
`),e.push(`    ///
`),e.push("    /// `loader` is duck-typed and can be either a container or an instance, so long as it satisfies\n"),e.push(`    /// the following code:
`),e.push(`    ///
`),e.push("    /// ```\n"),e.push(`    /// const prefixed_command_name: [:0]const u8 = "glExample";
`),e.push(`    /// const AnyCFnPtr = *align(@alignOf(fn () callconv(.C) void)) const anyopaque;
`),e.push(`    /// const fn_ptr_opt: ?AnyCFnPtr = loader.GetCommandFnPtr(prefixed_command_name);
`),e.push(`    /// _ = fn_ptr_opt;
`),u&&(e.push(`    ///
`),e.push(`    /// const prefixed_extension_name: [:0]const u8 = "GL_EXT_example";
`),e.push(`    /// const supported: bool = loader.extensionSupported(prefixed_extension_name);
`),e.push(`    /// _ = supported;
`)),e.push("    /// ```\n"),e.push(`    ///
`),e.push("    /// No references to `loader` are retained after this function returns. There is no\n"),e.push("    /// corresponding `deinit()` function.\n"),e.push(`    pub fn init(self: *DispatchTable, loader: anytype) bool {
`),e.push(`        @setEvalBranchQuota(1_000_000);
`),e.push(`        var success: u1 = 1;
`),e.push(`        inline for (@typeInfo(DispatchTable).Struct.fields) |field_info| {
`),e.push(`            const prefixed_feature_name = comptime nullTerminate(field_info.name);
`),e.push(`            switch (@typeInfo(field_info.type)) {
`),e.push(`                .Pointer => |ptr_info| switch (@typeInfo(ptr_info.child)) {
`),e.push(`                    .Fn => success &= @intFromBool(self.load(loader, prefixed_feature_name)),
`),e.push(`                    else => comptime unreachable,
`),e.push(`                },
`),u&&(e.push(`                .Bool => @field(self, prefixed_feature_name) = false,
`),e.push(`                .Optional => |opt_info| switch (@typeInfo(opt_info.child)) {
`),e.push(`                    .Pointer => |ptr_info| switch (@typeInfo(ptr_info.child)) {
`),e.push(`                        .Fn => @field(self, prefixed_feature_name) = null,
`),e.push(`                        else => comptime unreachable,
`),e.push(`                    },
`),e.push(`                    else => comptime unreachable,
`),e.push(`                },
`)),e.push(`                else => comptime unreachable,
`),e.push(`            }
`),e.push(`        }
`);for(const o of t.extensions.values()){e.push(`        if (loader.extensionSupported("${o.key}")) {
`);for(const h of o.commands.map(S=>t.commands.get(S)))e.push(`            _ = self.load(loader, "${h.key}");
`);e.push(`            self.${y(o.key)} = true;
`),e.push(`        }
`)}return e.push(`        return success != 0;
`),e.push(`    }
`),e.push(`
`),e.push(`    fn nullTerminate(comptime string: []const u8) [:0]const u8 {
`),e.push(`        comptime {
`),e.push(`            var buf: [string.len + 1]u8 = undefined;
`),e.push(`            std.mem.copy(u8, &buf, string);
`),e.push(`            buf[string.len] = 0;
`),e.push(`            return buf[0..string.len :0];
`),e.push(`        }
`),e.push(`    }
`),e.push(`
`),e.push(`    fn load(
`),e.push(`        self: *DispatchTable,
`),e.push(`        loader: anytype,
`),e.push(`        comptime prefixed_command_name: [:0]const u8,
`),e.push(`    ) bool {
`),e.push(`        const FieldType = @TypeOf(@field(self, prefixed_command_name));
`),e.push(`        const AnyCFnPtr = *align(@alignOf(fn () callconv(.C) void)) const anyopaque;
`),e.push(`        const fn_ptr_opt: ?AnyCFnPtr = loader.getCommandFnPtr(prefixed_command_name);
`),e.push(`        if (fn_ptr_opt) |fn_ptr| {
`),e.push(`            @field(self, prefixed_command_name) = @ptrCast(fn_ptr);
`),e.push(`            return true;
`),e.push(`        } else {
`),e.push(`            return @typeInfo(FieldType) == .Optional;
`),e.push(`        }
`),e.push(`    }
`),e.push(`
`),e.push(`    /// Invokes the specified OpenGL command with the specified arguments. The invocation will not
`),e.push(`    /// be intercepted.
`),e.push(`    pub fn invoke(
`),e.push(`        self: *const DispatchTable,
`),e.push(`        comptime prefixed_command_name: [:0]const u8,
`),e.push(`        args: anytype,
`),e.push(`    ) ReturnType(prefixed_command_name) {
`),e.push(`        const FieldType = @TypeOf(@field(self, prefixed_command_name));
`),e.push(`        return if (@typeInfo(FieldType) == .Optional)
`),e.push(`            @call(.auto, @field(self, prefixed_command_name).?, args)
`),e.push(`        else
`),e.push(`            @call(.auto, @field(self, prefixed_command_name), args);
`),e.push(`    }
`),e.push(`
`),e.push(`    /// Invokes the specified OpenGL command with the specified arguments. The invocation will be
`),e.push("    /// intercepted by `options.intercept()`.\n"),e.push(`    pub fn invokeIntercepted(
`),e.push(`        self: *const DispatchTable,
`),e.push(`        comptime prefixed_command_name: [:0]const u8,
`),e.push(`        args: anytype,
`),e.push(`    ) ReturnType(prefixed_command_name) {
`),e.push(`        return options.intercept(self, prefixed_command_name, args);
`),e.push(`    }
`),e.push(`
`),e.push(`    pub fn ReturnType(comptime prefixed_command_name: [:0]const u8) type {
`),e.push(`        const FieldType = @TypeOf(@field(@as(DispatchTable, undefined), prefixed_command_name));
`),e.push(`        if (@hasField(DispatchTable, prefixed_command_name)) {
`),e.push(`            switch (@typeInfo(FieldType)) {
`),e.push(`                .Pointer => |ptr_info| switch (@typeInfo(ptr_info.child)) {
`),e.push(`                    .Fn => |fn_info| return fn_info.return_type.?,
`),e.push(`                    else => comptime unreachable,
`),e.push(`                },
`),e.push(`                .Bool => {},
`),e.push(`                .Optional => |opt_info| switch (@typeInfo(opt_info.child)) {
`),e.push(`                    .Pointer => |ptr_info| switch (@typeInfo(ptr_info.child)) {
`),e.push(`                        .Fn => |fn_info| return fn_info.return_type.?,
`),e.push(`                        else => comptime unreachable,
`),e.push(`                    },
`),e.push(`                    else => comptime unreachable,
`),e.push(`                },
`),e.push(`                else => comptime unreachable,
`),e.push(`            }
`),e.push(`        }
`),e.push(`        @compileError("unknown command: '" ++ prefixed_command_name ++ "'");
`),e.push(`    }
`),e.push(`};
`),e.push(`
`),e.push("/// Options that can be overriden by publicly declaring a container named `gl_options` in the root\n"),e.push(`/// source file.
`),e.push(`pub const options = struct {
`),e.push(`    /// Intercepts OpenGL command invocations.
`),e.push(`    pub const intercept: @TypeOf(struct {
`),e.push(`        fn intercept(
`),e.push(`            dispatch_table: *const DispatchTable,
`),e.push(`            comptime prefixed_command_name: [:0]const u8,
`),e.push(`            args: anytype,
`),e.push(`        ) DispatchTable.ReturnType(prefixed_command_name) {
`),e.push(`            _ = args;
`),e.push(`            _ = dispatch_table;
`),e.push(`            comptime unreachable;
`),e.push(`        }
`),e.push(`    }.intercept) = if (@hasDecl(options_overrides, "intercept"))
`),e.push(`        options_overrides.intercept
`),e.push(`    else
`),e.push(`        DispatchTable.invoke;
`),e.push(`};
`),e.push(`
`),e.push(`const options_overrides = if (@hasDecl(root, "gl_options")) root.gl_options else struct {};
`),e.push(`
`),e.push(`comptime {
`),e.push(`    for (@typeInfo(options_overrides).Struct.decls) |decl| {
`),e.push(`        if (!@hasDecl(options, decl.name)) @compileError("unknown option: '" ++ decl.name ++ "'");
`),e.push(`    }
`),e.push(`}
`),e.push(`
`),e.push(`test {
`),e.push(`    @setEvalBranchQuota(1_000_000);
`),e.push(`    std.testing.refAllDeclsRecursive(@This());
`),e.push(`}
`),e.join("")}function y(t){return P.test(t)?t:`@"${t}"`}const P=RegExp(`^(?!(${["_","addrspace","align","allowzero","and","anyframe","anytype","asm","async","await","break","callconv","catch","comptime","const","continue","defer","else","enum","errdefer","error","export","extern","fn","for","if","inline","linksection","noalias","noinline","nosuspend","opaque","or","orelse","packed","pub","resume","return","struct","suspend","switch","test","threadlocal","try","union","unreachable","usingnamespace","var","volatile","while","anyerror","anyframe","anyopaque","bool","c_char","c_int","c_long","c_longdouble","c_longlong","c_short","c_uint","c_ulong","c_ulonglong","c_ushort","comptime_float","comptime_int","f128","f16","f32","f64","f80","false","isize","noreturn","null","true","type","undefined","usize","void","([iu][0-9]+)"].join("|")})$)[A-Z_a-z][0-9A-Z_a-z]*$`),C=new Map([["GLbyte","Byte","i8"],["GLubyte","Ubyte","u8"],["GLshort","Short","c_short"],["GLushort","Ushort","c_ushort"],["GLint","Int","c_int"],["GLuint","Uint","c_uint"],["GLint64","Int64","i64"],["GLint64EXT","Int64EXT","i64"],["GLuint64","Uint64","u64"],["GLuint64EXT","Uint64EXT","u64"],["GLintptr","Intptr","isize"],["GLintptrARB","IntptrARB","isize"],["GLhalf","Half","c_ushort"],["GLhalfARB","HalfARB","c_ushort"],["GLhalfNV","HalfNV","c_ushort"],["GLfloat","Float","f32"],["GLdouble","Double","f64"],["GLfixed","Fixed","i32"],["GLboolean","Boolean","u8"],["GLchar","Char","u8"],["GLcharARB","CharARB","u8"],["GLbitfield","Bitfield","c_uint"],["GLenum","Enum","c_uint"],["GLsizei","Sizei","c_int"],["GLsizeiptr","Sizeiptr","isize"],["GLsizeiptrARB","SizeiptrARB","isize"],["GLclampf","Clampf","f32"],["GLclampd","Clampd","f64"],["GLclampx","Clampx","i32"],["GLsync","Sync","?*opaque {}"],["GLDEBUGPROC","Debugproc",'?*const fn (source: Enum, @"type": Enum, id: Uint, severity: Enum, length: Sizei, message: [*:0]const Char, userParam: ?*const anyopaque) callconv(.C) void'],["GLDEBUGPROCARB","DebugprocARB",'?*const fn (source: Enum, @"type": Enum, id: Uint, severity: Enum, length: Sizei, message: [*:0]const Char, userParam: ?*const anyopaque) callconv(.C) void'],["GLDEBUGPROCKHR","DebugprocKHR",'?*const fn (source: Enum, @"type": Enum, id: Uint, severity: Enum, length: Sizei, message: [*:0]const Char, userParam: ?*const anyopaque) callconv(.C) void'],["GLDEBUGPROCAMD","DebugprocAMD","?*const fn (id: Uint, category: Enum, severity: Enum, length: Sizei, message: [*:0]const Char, userParam: ?*anyopaque) callconv(.C) void"],["struct _cl_context","ClContextARB","opaque {}"],["struct _cl_event","ClEventARB","opaque {}"],["GLeglClientBufferEXT","EglClientBufferEXT","?*anyopaque"],["GLeglImageOES","EglImageOES","?*anyopaque"],["GLhandleARB","HandleARB",'if (@import("builtin").os.tag == .macos) ?*anyopaque else c_uint'],["GLvdpauSurfaceNV","VdpauSurfaceNV","Intptr","GLintptr"],["GLVULKANPROCNV","VulkanprocNV","?*const fn () callconv(.C) void"]].map((t,i)=>[t[0],{key:t[0],name:t[1],type:t[2],typeDependency:t[3]??null,ordinal:i}])),z=new Map([["GL_ZERO"],["GL_ONE"],["GL_FALSE"],["GL_TRUE"],["GL_NONE"],["GL_NONE_OES"],["GL_NO_ERROR"],["GL_INVALID_INDEX"],["GL_ALL_PIXELS_AMD"],["GL_TIMEOUT_IGNORED"],["GL_TIMEOUT_IGNORED_APPLE"],["GL_UUID_SIZE_EXT"],["GL_LUID_SIZE_EXT"]].map((t,i)=>[t[0],{ordinal:i}]));function M(t,i,d,r,u){const e=new Set,o=new Set,h=new Set,S=new Set(u),k=[],w=[],g=[],T=[],G=t.$root;{const n=[...G.querySelectorAll(`:scope > feature[api=${i}`)].map(p=>[p,p.getAttribute("number")]).filter(p=>p[1]<=d).sort((p,c)=>f(p[1],c[1])).map(p=>p[0]),s=":scope > require:not([profile]) > *"+(r?`, :scope > require[profile=${r}] > *`:""),a=":scope > remove:not([profile]) > *"+(r?`, :scope > remove[profile=${r}] > *`:"");for(const p of n){for(const c of p.querySelectorAll(s)){const l=c.getAttribute("name");switch(c.tagName){case"type":e.add(l);break;case"enum":o.add(l);break;case"command":h.add(l);break}}for(const c of p.querySelectorAll(a)){const l=c.getAttribute("name");switch(c.tagName){case"type":e.delete(l);break;case"enum":o.delete(l);break;case"command":h.delete(l);break}}}}{const n=(r?[":scope > require:not([api]):not([profile]) > *",`:scope > require:not([api])[profile=${r}] > *`,`:scope > require[api=${i}]:not([profile]) > *`,`:scope > require[api=${i}][profile=${r}] > *`]:[":scope > require:not([api]) > *",`:scope > require[api=${i}] > *`]).join(", ");for(const s of G.querySelectorAll(":scope > extensions > extension")){const a=s.getAttribute("name");if(!S.has(a)||!s.getAttribute("supported").split("|").includes(i))continue;const p=new Set;for(const c of s.querySelectorAll(n)){const l=c.getAttribute("name");switch(c.tagName){case"type":e.add(l);break;case"enum":o.add(l);break;case"command":h.has(l)||p.add(l);break}}T.push({key:a,name:a,commands:[...p].sort(f)})}T.sort((s,a)=>f(s.name,a.name))}{const n=new Set(T.flatMap(a=>a.commands));for(const a of G.querySelectorAll(":scope > commands > command")){let p=function(_){const m=_.match(/(struct\s+)?[^\s*]+|\*/g);if(m[0]==="const"&&([m[0],m[1]]=[m[1],m[0]]),!m.includes("*"))return m[0]==="void"?"void":C.get(m[0]).name;let[E,D]=m[0]==="void"?["anyopaque","?*"]:m[0].startsWith("struct _cl_")?[C.get(m[0]).name,"?*"]:[C.get(m[0]).name,"[*c]"];for(let $=1;$<m.length-1;$++)switch(m[$]){case"const":E="const "+E;break;case"*":E=D+E,D="[*c]";break}return E};const c=a.querySelector(":scope > proto > name").textContent,l=h.has(c);if(!l&&!n.has(c))continue;const b=a.querySelector(":scope > proto"),v=b.querySelector(":scope > ptype")?.textContent;v&&e.add(v),g.push({key:c,name:c,params:[...a.querySelectorAll(":scope > param")].map(_=>{const m=_.querySelector(":scope > ptype")?.textContent;return m&&e.add(m),{name:_.querySelector(":scope > name").textContent,type:p(_.textContent)}}),type:p(b.textContent),optional:!l})}g.sort((a,p)=>f(a.name,p.name));const s=new Set(["std","root","about","makeDispatchTableCurrent","getCurrentDispatchTable","extensionSupported","options","options_override",...g.map(a=>a.name)]);for(const a of g)for(const p of a.params)for(;s.has(p.name);)p.name+="_"}{for(const n of G.querySelectorAll(":scope > enums")){const s=n.getAttribute("group"),a=s==="SpecialNumbers"?"special-number":n.getAttribute("type")==="bitmask"?"bitmask":n.hasAttribute("start")?"enum":"other";for(const p of n.querySelectorAll(":scope > enum")){const c=p.getAttribute("name");if(!o.has(c))continue;const l=p.getAttribute("api");if(l&&l!==i)continue;let b=-1;if(a==="special-number"){const _=z.get(c)?.ordinal;if(_===void 0)continue;b=_}const v=BigInt(p.getAttribute("value"));w.push({key:c,name:c,value:v.toString(16).toUpperCase().replace(/[0-9A-F]+$/,_=>"0x"+_),numericValue:v,kind:a,group:s,specialNumberOrdinal:b})}}w.sort((n,s)=>n.kind==="special-number"?s.kind==="special-number"?n.specialNumberOrdinal-s.specialNumberOrdinal:-1:s.kind==="special-number"?1:n.kind==="bitmask"?s.kind==="bitmask"?f(n.group,s.group)||f(n.numericValue,s.numericValue)||f(n.name,s.name):-1:s.kind==="bitmask"?1:n.kind==="enum"?s.kind==="enum"?f(n.numericValue,s.numericValue)||f(n.name,s.name):-1:s.kind==="enum"?1:f(n.group,s.group)||f(n.numericValue,s.numericValue)||f(n.name,s.name))}{for(const n of e){const s=C.get(n);s&&(s.typeDependency&&e.add(s.typeDependency),k.push(s))}k.sort((n,s)=>n.ordinal-s.ordinal)}return{types:new Map(k.map(n=>[n.key,n])),constants:new Map(w.map(n=>[n.key,n])),commands:new Map(g.map(n=>[n.key,n])),extensions:new Map(T.map(n=>[n.key,n]))}}const q=await R(new URL("/assets/gl-3c68f4c8.xml",self.location)),V=document.getElementById("loading"),A=document.getElementById("form"),x=A.querySelector("[name=api_version_profile]"),L=A.querySelector("[name=extension]"),O=document.getElementById("preview"),X=O.querySelector("code");let I=null;x.addEventListener("change",()=>{const[t]=x.value.split(",");if(t===I)return;I=t??null;const i=q.apis.get(t).extensions;for(;L.firstChild;)L.removeChild(L.lastChild);for(const d of i){const r=d.replace(/^GL_/,""),u=document.createElement("option");u.value=d,u.textContent=r,L.appendChild(u)}});x.dispatchEvent(new Event("change"));A.addEventListener("submit",t=>{t.preventDefault();const[i,d,r]=x.value.split(","),u=[...L.selectedOptions].map(h=>h.value),e=M(q,i,d,r??null,u),o=U(e,x.selectedOptions.item(0).textContent);switch(t.submitter.value){case"Preview":O.hidden=!1,X.textContent=o;break;case"Download":const h=document.createElement("a");h.href=URL.createObjectURL(new Blob([o],{type:"text/plain"})),h.download="gl.zig",h.click();break}});V.hidden=!0;A.hidden=!1;
