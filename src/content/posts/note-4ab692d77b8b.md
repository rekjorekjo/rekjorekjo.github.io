---
title: CISCN_19th
description: reverse Eternum 打开ida发现函数巨少，怀疑加壳，exeinfope打开检测到UPX
  执行后发现体积增加一倍，大概率成功了。ida正常打开 搜索函数发现找不到main.main函数，这里可以使用工具恢复符号表，注意是go语言
  下载GoReSym 先生成syms.j
date: 2026-01-27T14:50:46.000Z
categories:
  - competitions
tags: []
minutes: 42
demo: false
draft: false
---


***


## reverse

### Eternum

打开ida发现函数巨少，怀疑加壳，exeinfope打开检测到UPX

```bash
./upx.exe -d kworker
```

执行后发现体积增加一倍，大概率成功了。ida正常打开

```c
void __gostk __noreturn start_0(char a1)
{
  _BYTE v11[65536]; // [rsp+0h] [rbp-10028h] BYREF
  _QWORD v12[3]; // [rsp+10000h] [rbp-28h] BYREF
  void *v13; // [rsp+10018h] [rbp-10h]
  char *v14; // [rsp+10020h] [rbp-8h]
  void *retaddr; // [rsp+10028h] [rbp+0h]

  v13 = retaddr;
  v14 = &a1;
  qword_9A9CE0[2] = v11;
  qword_9A9CE0[3] = v11;
  qword_9A9CE0[0] = v11;
  qword_9A9CE0[1] = v12;
  _RAX = 0;
  __asm { cpuid }
  if ( (_DWORD)_RAX )
  {
    if ( (_DWORD)_RBX == 1970169159 && (_DWORD)_RDX == 1231384169 && (_DWORD)_RCX == 1818588270 )
      byte_9CB45E = 1;
    _RAX = 1;
    __asm { cpuid }
    RAX = _RAX;
  }
  if ( qword_9A8558 )
  {
    qword_9A8558();
    qword_9A9CE0[2] = qword_9A9CE0[0] + 928LL;
    qword_9A9CE0[3] = qword_9A9CE0[0] + 928LL;
  }
  else
  {
    sub_483D60(&n291);
    __writefsqword(0xFFFFFFF8, 0x123u);
    if ( n291 != 291 )
      sub_481D00();
  }
  __writefsqword(0xFFFFFFF8, (unsigned __int64)qword_9A9CE0);
  qword_9AAC20[0] = qword_9A9CE0;
  qword_9A9CE0[6] = qword_9AAC20;
  sub_4848E0();
  v12[2] = sub_4848A0((_DWORD)v13, (__int64)v14);
  sub_4846C0();
  sub_484800();
  v12[0] = sub_484860((__int64)&off_74A8F8);
  sub_47FF20();
  sub_481D00();
}
```

搜索函数发现找不到main.main函数，这里可以使用工具恢复符号表，注意是go语言

下载GoReSym

```bash
./GoReSym.exe -d -t kworker > syms.json
```

先生成syms.json，再在ida中file选择scriptfile，运行GoReSym.py，弹窗的时候选择刚生成的syms.json

```python
# Copyright (C) 2022 Mandiant, Inc. All Rights Reserved.
import atexit
import json
import os
CLI_AVAILABLE = True
try:
    import idapro
except ImportError:
    CLI_AVAILABLE = False
import idaapi
import ida_bytes
import ida_funcs
import ida_name
import ida_typeinf
import ida_kernwin

def iterable(obj):
    if obj is None:
        return False

    try:
        iter(obj)
    except Exception:
        return False
    else:
        return True

# https://gist.github.com/NyaMisty/693db2ce2e75c230f36b628fd7610852
# 'Synchonize to idb' right click equivalent
def resync_local_types():
    def is_autosync(name, tif):
        return idaapi.get_ordinal_from_idb_type(name, tif.get_decltype().to_bytes(1, "little")) != -1

    for ord in range(1, idaapi.get_ordinal_qty(None)):
        t = idaapi.tinfo_t()
        t.get_numbered_type(None, ord)
        typename = t.get_type_name()
        if typename.startswith("#"):
            continue

        autosync = is_autosync(typename, t)
        # print('Processing struct %d: %s%s' % (ord, typename, ' (autosync) ' if autosync else ''))
        idaapi.import_type(None, -1, typename, idaapi.IMPTYPE_OVERRIDE)
        if autosync:
            continue
        struc = idaapi.get_struc(idaapi.get_struc_id(typename))
        if not struc:
            continue
        struc.ordinal = -1
        idaapi.save_struc(struc, False)

def get_type_by_name(name):
    t = idaapi.tinfo_t()
    t.get_named_type(None, name)
    return t

def set_function_signature(ea, typedef):
    idaapi.apply_type(ea, ida_typeinf.parse_decl(typedef, ida_typeinf.PT_SIL), idaapi.TINFO_DEFINITE)

def import_primitives():
    type_map = {
        "BUILTIN_STRING": "string",
        "uint8_t": "uint8",
        "uint16_t": "uint16",
        "uint32_t": "uint32",
        "uint64_t": "uint64",
        "int8_t": "int8",
        "int16_t": "int16",
        "int32_t": "int32",
        "double": "float64",
        "float": "float32",
        "complex64_t": "complex64",
        "complex128_t": "complex128",
        "void*": "uintptr",  # should be uint64 or uint32 depending on ptr size, but this works too
        "uint8": "byte",
        "int32": "rune",
        "int": "void*",  # int in GO depends on architecture size
    }

    ida_typeinf.idc_parse_types("struct BUILTIN_INTERFACE{void *tab;void *data;};", ida_typeinf.HTI_PAKDEF | ida_typeinf.HTI_DCL)
    ida_typeinf.idc_parse_types("struct BUILTIN_STRING{char *ptr;size_t len;};", ida_typeinf.HTI_PAKDEF | ida_typeinf.HTI_DCL)

    ida_typeinf.idc_parse_types("struct complex64_t{float real;float imag;};", ida_typeinf.HTI_PAKDEF | ida_typeinf.HTI_DCL)
    ida_typeinf.idc_parse_types("struct complex128_t{double real;double imag;};", ida_typeinf.HTI_PAKDEF | ida_typeinf.HTI_DCL)

    for ida_type, gotype in type_map.items():
        ida_typeinf.idc_parse_types(f"typedef {ida_type} {gotype};", ida_typeinf.HTI_PAKDEF | ida_typeinf.HTI_DCL)

def forward_declare_structs(types):
    for typ in types:
        if typ["Kind"] == "Struct":
            ida_typeinf.idc_parse_types(f"struct {typ['CStr']};", ida_typeinf.HTI_PAKDEF | ida_typeinf.HTI_DCL)

def main(json_file):
    with open(json_file, "r", encoding="utf-8") as rp:
        buf = rp.read()

    hints = json.loads(buf)
    if iterable(hints["UserFunctions"]):
        for func in hints["UserFunctions"]:
            ida_bytes.del_items(func["Start"])
            ida_funcs.add_func(func["Start"])
            print("Renaming %s to %s" % (hex(func["Start"]), func["FullName"]))
            idaapi.add_func(func["Start"], func["End"])
            idaapi.set_name(func["Start"], func["FullName"], idaapi.SN_NOWARN | idaapi.SN_NOCHECK | ida_name.SN_FORCE)

    if iterable(hints["StdFunctions"]):
        for func in hints["StdFunctions"]:
            print("Renaming %s to %s" % (hex(func["Start"]), func["FullName"]))
            ida_bytes.del_items(func["Start"])
            ida_funcs.add_func(func["Start"])
            idaapi.add_func(func["Start"], func["End"])
            idaapi.set_name(func["Start"], func["FullName"], idaapi.SN_NOWARN | idaapi.SN_NOCHECK | ida_name.SN_FORCE)

    if iterable(hints["Types"]):
        import_primitives()

        # we must do this to prevent IDA from creating an invalid struct of type int when we import things like typedef <class>* <newname>.
        # it would have made typedef struct <class> int; without a forward declaration. That would then break importing the class later with redefinition error.
        forward_declare_structs(hints["Types"])

        for typ in hints["Types"][::-1]:
            if typ.get("CReconstructed"):
                errors = ida_typeinf.idc_parse_types(typ["CReconstructed"] + ";", ida_typeinf.HTI_PAKDEF | ida_typeinf.HTI_DCL)
                if errors > 0:
                    print(typ["CReconstructed"], "failed to import")

        # just for precation
        # resync_local_types()

        for typ in hints["Types"]:
            print("Renaming %s to %s" % (hex(typ["VA"]), typ["Str"]))
            idaapi.set_name(typ["VA"], typ["Str"], idaapi.SN_NOWARN | idaapi.SN_NOCHECK | ida_name.SN_FORCE)

            # IDA often thinks these are string pointers, lets undefine that, then set the type correctly
            ida_bytes.del_items(typ["VA"], 0, 4)
            abi_typ = get_type_by_name("abi_Type")
            idaapi.apply_tinfo(typ["VA"], abi_typ, idaapi.TINFO_DEFINITE)

    if iterable(hints["Interfaces"]):
        for typ in hints["Interfaces"]:
            print("Renaming %s to %s" % (hex(typ["VA"]), typ["Str"]))
            idaapi.set_name(typ["VA"], typ["Str"], idaapi.SN_NOWARN | idaapi.SN_NOCHECK | ida_name.SN_FORCE)

            # IDA often thinks these are string pointers, lets undefine that, then set the type correctly
            ida_bytes.del_items(typ["VA"], 0, 4)
            abi_typ = get_type_by_name("abi_Type")
            idaapi.apply_tinfo(typ["VA"], abi_typ, idaapi.TINFO_DEFINITE)

    if hints["TabMeta"] is not None:
        tabmeta = hints["TabMeta"]
        va = tabmeta["VA"]
        if va is not None and va != 0:
            idaapi.set_name(va, "runtime_pclntab", idaapi.SN_NOWARN | idaapi.SN_NOCHECK | ida_name.SN_FORCE)

    if hints["ModuleMeta"] is not None:
        modmeta = hints["ModuleMeta"]
        va = modmeta["VA"]
        if va is not None and va != 0:
            idaapi.set_name(va, "runtime_firstmoduledata", idaapi.SN_NOWARN | idaapi.SN_NOCHECK | ida_name.SN_FORCE)

def getargs() -> str:
    import argparse

    parser = argparse.ArgumentParser(description="Apply GoReSym renaming and type hints to an IDA database.")
    parser.add_argument("binary", help="Path to the Go binary file.")
    parser.add_argument("json_file", help="Path to the GoReSym output JSON file.")
    args = parser.parse_args()
    assert os.path.isfile(args.json_file)
    assert os.path.isfile(args.binary)
    idapro.open_database(args.binary, run_auto_analysis=True)
    atexit.register(idapro.close_database, True)
    return args.json_file

if __name__ == "__main__":
    json_path = None
    if CLI_AVAILABLE and ida_kernwin.is_ida_library(None, 0, None):
        json_path = getargs()
    else:
        json_path = ida_kernwin.ask_file(0, "*.json", "GoReSym output file")
    assert json_path is not None and os.path.isfile(json_path)

    main(json_path)
```

可以清楚的看到main_main函数了：

```c
void __fastcall main_main()
{
  __int64 v0; // rcx
  __int64 v1; // rax
  void (*v2)(); // rax
  __int64 v3; // rcx
  __int64 v4; // rsi
  _QWORD *v5; // r11
  void (**v6)(); // rax
  void (*v7)(); // rcx
  void (**v8)(); // r11
  __int64 v9; // [rsp-20h] [rbp-80h]
  __int64 v10; // [rsp+0h] [rbp-60h]
  __int64 v11; // [rsp+8h] [rbp-58h]
  void (*v12)(); // [rsp+10h] [rbp-50h]
  __int64 v13; // [rsp+18h] [rbp-48h]
  __int64 v14; // [rsp+28h] [rbp-38h]

  if ( (unsigned __int64)qword_9A8A58 <= 1 )
    runtime_panicIndex();
  v10 = *(_QWORD *)(qword_9A8A50 + 24);
  v13 = *(_QWORD *)(qword_9A8A50 + 16);
  v9 = iGw9vplejnCj_FPKxH3Y();
  v14 = v0;
  v11 = v1;
  v2 = (void (*)())runtime_newobject();
  *((_QWORD *)v2 + 3) = v10;
  if ( dword_9CB880 )
  {
    v2 = (void (*)())runtime_gcWriteBarrier3();
    v3 = v13;
    *v5 = v13;
    v5[1] = &qword_9CB440;
    v4 = v14;
    v5[2] = v14;
  }
  else
  {
    v3 = v13;
    v4 = v14;
  }
  v12 = v2;
  *((_QWORD *)v2 + 2) = v3;
  *((_QWORD *)v2 + 4) = v11;
  *((_QWORD *)v2 + 5) = &qword_9CB440;
  *((_QWORD *)v2 + 6) = v4;
  runtime_makechan(v9);
  ktyrAE7wjsb_AmuaG1Qm280(2);
  v6 = (void (**)())runtime_newobject();
  *v6 = main_main_func1;
  if ( dword_9CB880 )
  {
    v6 = (void (**)())runtime_gcWriteBarrier1();
    v7 = v12;
    *v8 = v12;
  }
  else
  {
    v7 = v12;
  }
  v6[1] = v7;
  runtime_newproc();
  runtime_chanrecv1_0();
  iupHvc2q4__ptr_H1eV17y_Stop();
}
```

调用main_main_func1:

```c
void main_main_func1()
{
  __int64 v0; // rax

  iupHvc2q4__ptr_H1eV17y_Run();
  if ( v0 )
    awEyXg__XQAGaYMFU();
}
```

查看iupHvc2q4__ptr_H1eV17y_Run和awEyXg__XQAGaYMFU()可以发现这些函数似乎都混淆过，函数名字异常

于是直接尝试全局搜索字符串。搜索flag和input没有得到有效信息，搜索correct得到了：

```c
_QWORD *__fastcall iaSA9mr2gf8_jtRN1wjqpf(__int64 a1, __int64 a2, __int64 a3, __int64 a4)
{
  _QWORD *v4; // rax
  _QWORD *v5; // rbx
  _QWORD *v6; // rax
  __int64 v8; // rax
  __int64 v9; // rcx
  _QWORD *v10; // rax
  _QWORD *v11; // [rsp+30h] [rbp+8h]

  if ( (unsigned __int64)(a1 - 12) > 4 )
  {
    v10 = (_QWORD *)runtime_newobject();
    v10[1] = 39;
    *v10 = "cipher: incorrect tag size given to GCM";
    return 0;
  }
  else if ( a4 > 0 )
  {
    v11 = v4;
    *v4 = *v5;
    v8 = sub_48275C(v4 + 1, v5 + 1);
    *(_QWORD *)(v8 + 488) = v9;
    *(_QWORD *)(v8 + 496) = a1;
    iaSA9mr2gf8_ivyhuO1gq();
    return v11;
  }
  else
  {
    v6 = (_QWORD *)runtime_newobject();
    v6[1] = 40;
    *v6 = "cipher: the nonce can't have zero length";
    return 0;
  }
}
```

看到cipher可知方向正确。**AES-GCM加密**

需要交叉引用溯源到真正的加密函数。HpkfE6vaP2b_e1JiVk9Nmh，HpkfE6vaP2b_EojfYcyL，

iupHvc2q4_HaNDRB_IhET，iupHvc2q4_P3xHxov3，iupHvc2q4_OnJCbKpp，经历了3-4层溯源，找到了：

```c++
__int64 __fastcall iupHvc2q4_OnJCbKpp(__int64 a1, __int64 a2, __int64 a3, int n8)
{
  __int64 v4; // rax
  __int64 n12; // rbx
  __int64 v6; // rax
  __int64 v7; // rdx
  __int64 v8; // rcx
  unsigned __int64 n0xC; // rcx
  char *xfqGcVjrOWp5tUGCPFQq448nPDjILTe7; // rdi
  __int64 v12; // [rsp+38h] [rbp+8h]

  if ( n12 >= 12
    && (v12 = v4, v6 = iupHvc2q4_ij_4UzpmoB(), (unsigned __int8)iupHvc2q4_xqAoq08EK(v6, n12, v7, n8, v8))
    && (n0xC = _byteswap_ulong(*(_DWORD *)(v12 + 8)) + 12, n12 >= (__int64)n0xC) )
  {
    if ( n0xC < 0xC )
      runtime_panicSliceB();
    xfqGcVjrOWp5tUGCPFQq448nPDjILTe7 = xfqGcVjrOWp5tUGCPFQq448nPDjILTe7;// "xfqGcVjrOWp5tUGCPFQq448nPDjILTe7"
    iupHvc2q4_P3xHxov3();
    if ( xfqGcVjrOWp5tUGCPFQq448nPDjILTe7 )
      return 0;
    else
      return iupHvc2q4_FGzKeOknh7S();
  }
  else
  {
    wnHD_M_PzeouNSB873g();
    return 0;
  }
}
```

发现xfqGcVjrOWp5tUGCPFQq448nPDjILTe7--AES密钥

继续交叉引用看看

```c
__int64 __fastcall iupHvc2q4__ptr_H1eV17y_fuzkMtvzPreC()
{
  __int64 *v0; // rax
  __int64 v1; // rcx
  __int64 *n4096_2; // rdx
  __int64 v3; // rbx
  __int64 v4; // rcx
  __int64 n4096; // rbx
  __int64 v6; // rax
  __int64 v7; // rcx
  __int64 result; // rax
  __int64 v9; // rdx
  __int64 v10; // rax
  __int64 v11; // rsi
  __int64 v12; // rdx
  __int64 v13; // rcx
  __int64 v14; // rdx
  __int64 v15; // r8
  __int64 v16; // rcx
  __int64 v17; // r9
  __int64 v18; // rax
  __int64 v19; // [rsp+10h] [rbp-110h]
  __int64 v20; // [rsp+10h] [rbp-110h]
  __int64 v21; // [rsp+18h] [rbp-108h]
  __int64 v22; // [rsp+18h] [rbp-108h]
  __int64 v23; // [rsp+20h] [rbp-100h]
  __int64 v24; // [rsp+20h] [rbp-100h]
  __int64 v25; // [rsp+28h] [rbp-F8h]
  __int64 v26; // [rsp+28h] [rbp-F8h]
  __int64 v27; // [rsp+30h] [rbp-F0h]
  __int64 v28; // [rsp+30h] [rbp-F0h]
  __int64 v29; // [rsp+38h] [rbp-E8h]
  __int64 v30; // [rsp+38h] [rbp-E8h]
  __int64 v31; // [rsp+48h] [rbp-D8h]
  __int64 v32; // [rsp+58h] [rbp-C8h]
  __int64 v33; // [rsp+68h] [rbp-B8h]
  __int64 *n4096_1; // [rsp+70h] [rbp-B0h]
  __int64 *n4096_3; // [rsp+78h] [rbp-A8h]
  __int64 *n4096_4; // [rsp+88h] [rbp-98h]
  __int64 v37; // [rsp+90h] [rbp-90h]
  __int64 v38; // [rsp+98h] [rbp-88h]
  _QWORD v39[10]; // [rsp+A0h] [rbp-80h] BYREF
  __int64 v40; // [rsp+F0h] [rbp-30h]
  unsigned int *v41; // [rsp+F8h] [rbp-28h]
  _QWORD *v42; // [rsp+100h] [rbp-20h]
  __int64 v43; // [rsp+108h] [rbp-18h]
  __int64 v44; // [rsp+110h] [rbp-10h]
  __int64 *v45; // [rsp+128h] [rbp+8h]

  v45 = v0;
  v1 = *v0;
  n4096_2 = (__int64 *)v0[1];
  n4096_4 = n4096_2;
  if ( *v0 )
  {
    v3 = *(_QWORD *)(v1 + 8);
    v4 = *(unsigned int *)(v1 + 16);
    while ( 1 )
    {
      v15 = v4;
      v16 = 16 * (*(_QWORD *)off_99B240 & v4);
      v17 = *(_QWORD *)((char *)off_99B240 + v16 + 8);
      if ( v17 == v3 )
        break;
      v4 = v15 + 1;
      if ( !v17 )
      {
        v18 = runtime_typeAssert();
        n4096_2 = n4096_4;
        v1 = v18;
        goto LABEL_3;
      }
    }
    v1 = *(_QWORD *)((char *)off_99B240 + v16 + 16);
  }
LABEL_3:
  n4096 = (__int64)&off_74C3A0;
  if ( (_UNKNOWN **)v1 != &off_74C3A0 )
    n4096_2 = 0;
  v43 = v1;
  if ( (_UNKNOWN **)v1 != &off_74C3A0 || n4096_2[1] < 4096 )
  {
    n4096_1 = (__int64 *)runtime_newobject();
    n4096 = 4096;
    v6 = runtime_makeslice();
    memset(v39, 0, sizeof(v39));
    v38 = v6;
    v39[0] = 4096;
    v39[1] = 4096;
    v39[2] = v43;
    v39[3] = n4096_4;
    v39[8] = -1;
    v39[9] = -1;
    if ( dword_9CB880 )
    {
      n4096 = (__int64)n4096_1;
      runtime_wbMove();
    }
    *n4096_1 = v38;
    qmemcpy(n4096_1 + 1, v39, 0x50u);
    n4096_2 = n4096_1;
  }
  n4096_3 = n4096_2;
  v37 = iupHvc2q4_ij_4UzpmoB();
  v33 = v7;
  while ( 1 )
  {
    (*(void (**)(void))(v45[4] + 32))();
    result = runtime_selectnbrecv();
    if ( (_BYTE)result )
      break;
    v42 = (_QWORD *)runtime_makeslice();
    hs8tyedGIE_c_YAII_mdDe9v(v19, v21, v23, v25, v27, v29);
    if ( !n4096_3 && (unsigned __int8)iupHvc2q4_xqAoq08EK(v37, n4096, v9, 8, v33) )
    {
      v41 = (unsigned int *)runtime_makeslice();
      hs8tyedGIE_c_YAII_mdDe9v(v19, v21, v23, v25, v27, v29);
      v32 = _byteswap_ulong(*v41);
      v40 = runtime_makeslice();
      hs8tyedGIE_c_YAII_mdDe9v(v20, v22, v24, v26, v28, v30);
      v10 = runtime_makeslice();
      if ( (_QWORD *)v10 != v42 )
        *(_QWORD *)v10 = *v42;
      v11 = (__int64)v41;
      if ( v41 != (unsigned int *)(v10 + 8) )
        *(_DWORD *)(v10 + 8) = *v41;
      v12 = v10 + ((-v32 >> 63) & 0xC);
      if ( v40 != v12 )
      {
        v42 = (_QWORD *)v10;
        runtime_memmove();
      }
      iupHvc2q4_OnJCbKpp(v32, v11, v12, v32 + 12);
      if ( !v32 )
      {
        v31 = v13;
        v44 = runtime_newobject();
        if ( !e0gmdfY_FlNdf20ka(&off_74C2A0, v44, v14, v31) )
          iupHvc2q4__ptr_H1eV17y_j1lMnJiJTD();
      }
    }
  }
  return result;
}
```

可知这个函数是**网络通信或数据流处理** 的主循环。结合附件的tcp.pcap，可以有一个大胆猜想

ET3RNUMX进行分割，**ztsd压缩**

```bash
pip install zstandard
```

直接对整个tcp.pcap进行解密

```python
import struct
import zstandard as zstd
from Crypto.Cipher import AES
from scapy.all import rdpcap, TCP, Raw

KEY = b"xfqGcVjrOWp5tUGCPFQq448nPDjILTe7"

def decrypt_pcap():
    pcap_file = "tcp.pcap"
    
    try:
        packets = rdpcap(pcap_file)
    except FileNotFoundError:
        return

    
    dctx = zstd.ZstdDecompressor()
    count = 0

    for i, pkt in enumerate(packets):
    
        if TCP in pkt and Raw in pkt:
            payload = bytes(pkt[Raw].load)
            
            magic_pos = payload.find(b"ET3RNUMX")
            if magic_pos == -1:
                continue
                
            count += 1
            
            try:
                len_start = magic_pos + 8
                if len_start + 4 > len(payload): continue
                
                data_len = struct.unpack(">I", payload[len_start:len_start+4])[0]
                
                chunk_start = len_start + 4
                chunk_end = chunk_start + data_len
                

                if chunk_end > len(payload):

                    encrypted_data = payload[chunk_start:] 
                else:
                    encrypted_data = payload[chunk_start : chunk_end]

                if len(encrypted_data) < 12: continue

                nonce = encrypted_data[:12]
                ciphertext = encrypted_data[12:]

                cipher = AES.new(KEY, AES.MODE_GCM, nonce=nonce)
                plaintext = cipher.decrypt(ciphertext)
                
                try:
                    # 尝试 Zstd 解压
                    final_data = dctx.decompress(plaintext, max_output_size=10485760)
                    note = "AES -> Zstd"
                except:
                    # 解压失败则认为是纯 AES
                    final_data = plaintext
                    note = "AES Only"

                print(f"\n[+] Packet {i} 解密成功 ({note}) | Len: {len(final_data)}")
                
                try:
                    text = final_data.decode('utf-8')

                    text = text.strip()

                    if len(text) > 500:
                        print(f"    内容: (长文本，前100字符) {text[:100]}...")

                        if "flag{" in text:
                            print(f"FLAG: {text[text.find('flag{'):text.find('}')+1]}")
                    else:
                        print(f"    内容: {text}")

                        if "flag{" in text:
                            print(f"\FLAG: {text}")
                            
                except:

                    print(f"    内容(Hex): {final_data[:20].hex()}...")

                    if final_data.startswith(b'\x89PNG'):
                        with open(f"pkt_{i}.png", "wb") as f:
                            f.write(final_data)
                        print(f"    [!] 已保存为图片: pkt_{i}.png")

            except Exception as e:
                print(f"[-] Packet {i} 解析失败: {e}")

if __name__ == "__main__":
    decrypt_pcap()
```

可以得到一个base32字符串：

KIMZWGCZ33MI3WGNJYG4YDALJSMIYDCLJUMRSDILJYGUZDMLLBGRQTIN3BGY2WCMLBHF6QU===

但是解码出来是错误的，分析发现前面的KI是噪声，去掉之后再解码得到:

`flag{b7c58700-2b01-4dd4-8526-a4a47a65a1a9}`



## Crypto

### RSA_NestingDoll

注意n不是素数

```python
import math
from Crypto.Util.number import long_to_bytes, inverse, isPrime

def get_primes(limit):
    """Generate a list of primes up to limit using Sieve of Eratosthenes."""
    primes = []
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for p in range(2, limit + 1):
        if is_prime[p]:
            primes.append(p)
            for i in range(p * p, limit + 1, p):
                is_prime[i] = False
    return primes

def solve():
    # 1. Parse output.txt
    print("[*] Reading output.txt...")
    try:
        with open("output.txt", "r") as f:
            lines = f.read().strip().split('\n')
            # Extract values dynamically based on labels
            n1 = int([l for l in lines if "inner RSA modulus" in l][0].split('=')[-1].strip())
            n = int([l for l in lines if "outer RSA modulus" in l][0].split('=')[-1].strip())
            c = int([l for l in lines if "Ciphertext" in l][0].split('=')[-1].strip())
    except Exception as e:
        print(f"[-] Error reading file: {e}")
        return

    print(f"[+] Loaded n1 (2048-bit)")
    print(f"[+] Loaded n  (4096-bit)")

    # 2. Generate small primes

    limit = 1 << 22
    print(f"[*] Generating primes up to 2^22 ({limit})...")
    primes = get_primes(limit)
    print(f"[+] Generated {len(primes)} primes.")

    # 3. Pollard's p-1 Attack on n

    print("[*] Starting factorization of outer modulus n...")
    
    factors = []
    curr_n = n
    # Start with 2^(n1) mod n. This ensures the 'p1' part of (P-1) is covered.
    x = pow(2, n1, curr_n)
    
    # Process primes in blocks for efficiency
    block_size = 1000
    idx = 0
    
    while idx < len(primes) and curr_n > 1:
        prev_x = x
        batch_exp = 1
        batch_primes = []
        
        # Build a batch
        for _ in range(block_size):
            if idx >= len(primes): break
            p = primes[idx]
            batch_exp *= p
            batch_primes.append(p)
            idx += 1
            
        # Exponentiate by batch
        x = pow(x, batch_exp, curr_n)
        
        # Check GCD to see if we found a factor
        g = math.gcd(x - 1, curr_n)
        
        if g > 1:
            if g < curr_n:
                # Clean split found
                print(f"[+] Found factor: {g}")
                factors.append(g)
                curr_n //= g
                x %= curr_n # Reduce x to the new modulus
            else:

                x = prev_x
                for p in batch_primes:
                    x = pow(x, p, curr_n)
                    g = math.gcd(x - 1, curr_n)
                    if g > 1:
                        if g < curr_n:
                            print(f"[+] Found factor (during backtrack): {g}")
                            factors.append(g)
                            curr_n //= g
                            x %= curr_n
                        elif g == curr_n:
                            # If curr_n is prime, it's the last factor.
                            if isPrime(curr_n):
                                factors.append(curr_n)
                                curr_n = 1
                                break
                            # If composite, we failed to split it with this prime (rare)
                if curr_n == 1: break

    if curr_n > 1:
        factors.append(curr_n)

    print(f"[+] Total factors found: {len(factors)}")
    if len(factors) != 4:
        print("[-] Warning: Expected 4 factors. Decryption may fail.")

    # 4. Recover n1 factors
    print("[*] Recovering inner factors (p1, q1, r1, s1)...")
    n1_factors = []
    for P in factors:
        p1 = math.gcd(P - 1, n1)
        n1_factors.append(p1)
    
    # 5. Decrypt
    print("[*] Decrypting...")
    phi = 1
    for p in n1_factors:
        phi *= (p - 1)
    
    e = 65537
    d = inverse(e, phi)
    m = pow(c, d, n1)
    
    flag_bytes = long_to_bytes(m)
    print(f"\n[+] Flag: {flag_bytes}")

if __name__ == "__main__":
    solve()
```

可得`flag{fak3_r5a_0f_euler_ph1_of_RSA_040a2d35}`



### EzFlag

ida打开读取main函数：

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  __int64 v3; // rax
  __int64 v4; // rax
  _QWORD v6[4]; // [rsp+0h] [rbp-50h] BYREF
  _BYTE v7[12]; // [rsp+20h] [rbp-30h] BYREF
  int v8; // [rsp+2Ch] [rbp-24h] BYREF
  char v9; // [rsp+33h] [rbp-1Dh]
  int j; // [rsp+34h] [rbp-1Ch]
  unsigned __int64 i; // [rsp+38h] [rbp-18h]

  std::string::basic_string(v6, argv, envp);
  std::operator<<<std::char_traits<char>>(&std::cout, "Enter password: ");
  std::getline<char,std::char_traits<char>,std::allocator<char>>(&std::cin, v6);
  if ( (unsigned __int8)std::operator!=<char>((__int64)v6, "V3ryStr0ngp@ssw0rd") )
  {
    v3 = std::operator<<<std::char_traits<char>>(&std::cout, "Wrong password!");
    std::ostream::operator<<(v3, &std::endl<char,std::char_traits<char>>);
  }
  else
  {
    std::operator<<<std::char_traits<char>>(&std::cout, "flag{");
    std::ostream::flush((std::ostream *)&std::cout);
    i = 1;
    for ( j = 0; j <= 31; ++j )
    {
      v9 = f(i);
      std::operator<<<std::char_traits<char>>(&std::cout, (unsigned int)v9);
      std::ostream::flush((std::ostream *)&std::cout);
      if ( j == 7 || j == 12 || j == 17 || j == 22 )
      {
        std::operator<<<std::char_traits<char>>(&std::cout, "-");
        std::ostream::flush((std::ostream *)&std::cout);
      }
      i *= 8LL;
      i += j + 64;
      v8 = 1;
      std::chrono::duration<long,std::ratio<1l,1l>>::duration<int,void>(v7, &v8);
      std::this_thread::sleep_for<long,std::ratio<1l,1l>>(v7);
    }
    v4 = std::operator<<<std::char_traits<char>>(&std::cout, "}");
    std::ostream::operator<<(v4, &std::endl<char,std::char_traits<char>>);
  }
  std::string::~string(v6);
  return 0;
}
```

调用了关键函数f

```c
__int64 __fastcall f(unsigned __int64 i)
{
  __int64 v2; // [rsp+10h] [rbp-20h]
  unsigned __int64 j; // [rsp+18h] [rbp-18h]
  __int64 v4; // [rsp+20h] [rbp-10h]
  __int64 v5; // [rsp+28h] [rbp-8h]

  v5 = 0;
  v4 = 1;
  for ( j = 0; j < i; ++j )
  {
    v2 = v4;
    v4 = ((_BYTE)v5 + (_BYTE)v4) & 0xF;
    v5 = v2;
  }
  return *(unsigned __int8 *)std::string::operator[](&K, v5);
}
```

f是计算斐波那契数列的函数，注意引用的k，

```asm
.bss:0000000000004300                                   ; _UNKNOWN K
.bss:0000000000004300 ??                                _ZL1K db    ? ;  
```

交叉引用可见

```c
int __fastcall __static_initialization_and_destruction_0()
{
  _BYTE v1[17]; // [rsp+7h] [rbp-19h] BYREF

  *(_QWORD *)&v1[1] = v1;
  std::string::basic_string(&K, "012ab9c3478d56ef", v1);
  std::__new_allocator<char>::~__new_allocator(v1);
  return __cxa_atexit((void (*)(void *))&std::string::~string, &K, &_dso_handle);
}
```

初始化k为012ab9c3478d56ef，解密即可

注意C++的溢出问题

```python
def solve():

    K = "012ab9c3478d56ef"

    fib_mod_16 = [0, 1, 1, 2, 3, 5, 8, 13, 5, 2, 7, 9, 0, 9, 9, 2, 11, 13, 8, 5, 13, 2, 15, 1]

    v11 = 1
    flag_body = ""
    mask_64 = 2**64 - 1  # 64位掩码，用于模拟 C++ 的溢出

    for i in range(32):

        idx = fib_mod_16[v11 % 24]
        
        char = K[idx]
        flag_body += char
        
        if i in [7, 12, 17, 22]:
            flag_body += "-"

        v11 = (v11 * 8 + i + 64)
        
        #强制进行 64 位截断
        v11 &= mask_64

    print(f"Flag: flag{{{flag_body}}}")

if __name__ == "__main__":
    solve()
```

`flag{10632674-1d219-09f29-14769-f60219a24}`

