// Copyright tom zhou<iwebpp@gmail.com>, 2015.
//
// device_wrap.cc, device stream binding
//

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

#include "node.h"
#include "node_buffer.h"
#include "req_wrap.h"
#include "util.h"
#include "handle_wrap.h"
#include "stream_wrap.h"
#include "device_wrap.h"

namespace node {

using v8::Object;
using v8::Handle;
using v8::Local;
using v8::Persistent;
using v8::Value;
using v8::HandleScope;
using v8::FunctionTemplate;
using v8::String;
using v8::Function;
using v8::TryCatch;
using v8::Context;
using v8::Arguments;
using v8::Integer;
using v8::Undefined;

#define TYPE_ERROR(msg) \
    ThrowException(Exception::TypeError(String::New(msg)));

Persistent<Function> deviceConstructor;

void DEVICEWrap::Initialize(Handle<Object> target) {
  StreamWrap::Initialize(target);

  HandleScope scope;

  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  t->SetClassName(String::NewSymbol("DEVICE"));

  t->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(t, "close", HandleWrap::Close);
  NODE_SET_PROTOTYPE_METHOD(t, "unref", HandleWrap::Unref);

  NODE_SET_PROTOTYPE_METHOD(t, "readStart", StreamWrap::ReadStart);
  NODE_SET_PROTOTYPE_METHOD(t, "readStop", StreamWrap::ReadStop);

  NODE_SET_PROTOTYPE_METHOD(t, "writeBuffer", StreamWrap::WriteBuffer);
  NODE_SET_PROTOTYPE_METHOD(t, "writeAsciiString", StreamWrap::WriteAsciiString);
  NODE_SET_PROTOTYPE_METHOD(t, "writeUtf8String", StreamWrap::WriteUtf8String);
  NODE_SET_PROTOTYPE_METHOD(t, "writeUcs2String", StreamWrap::WriteUcs2String);

  NODE_SET_PROTOTYPE_METHOD(t, "setIOCtl", SetIOCtl);


  deviceConstructor = Persistent<Function>::New(t->GetFunction());

  target->Set(String::NewSymbol("DEVICE"), deviceConstructor);
}


DEVICEWrap* DEVICEWrap::Unwrap(Local<Object> obj) {
  assert(!obj.IsEmpty());
  assert(obj->InternalFieldCount() > 0);
  return static_cast<DEVICEWrap*>(obj->GetPointerFromInternalField(0));
}


Local<Object> DEVICEWrap::Instantiate() {
  HandleScope scope;
  assert(!deviceConstructor.IsEmpty());
  return scope.Close(deviceConstructor->NewInstance());
}


uv_device_t* DEVICEWrap::UVHandle() {
  return &handle_;
}


Handle<Value> DEVICEWrap::SetIOCtl(const Arguments& args) {
  HandleScope scope;

  UNWRAP(DEVICEWrap)

  int cmd = args[0]->Int32Value();
  uv_ioargs_t* ctl = NULL;

  int r = uv_device_ioctl(&wrap->handle_, cmd, ctl);

  if (r) {
    SetErrno(uv_last_error(uv_default_loop()));
  }

  return scope.Close(Integer::New(r));
}


Handle<Value> DEVICEWrap::New(const Arguments& args) {
  HandleScope scope;

  // This constructor should not be exposed to public javascript.
  // Therefore we assert that we are not trying to call this as a
  // normal function.
  assert(args.IsConstructCall());

  if (!args[0]->IsString()) return TYPE_ERROR("device path must be a string");
  node::Utf8Value path(args[0]);

  int flags = args[1]->Int32Value();

  DEVICEWrap* wrap = new DEVICEWrap(args.This(), *path, flags);
  assert(wrap);
  wrap->UpdateWriteQueueSize();

  return scope.Close(args.This());
}


DEVICEWrap::DEVICEWrap(Handle<Object> object, const char* path, int flags)
    : StreamWrap(object, (uv_stream_t*)&handle_) {
  uv_device_init(uv_default_loop(), &handle_, path, flags);
}

}  // namespace node

NODE_MODULE(node_device_wrap, node::DEVICEWrap::Initialize)
