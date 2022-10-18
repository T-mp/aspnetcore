// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import { BootJsonData } from '../Platform/BootConfig';
import { WebAssemblyStartOptions } from '../Platform/WebAssemblyStartOptions';
import { JSInitializer } from './JSInitializers';

export async function fetchAndInvokeInitializers(bootConfig: BootJsonData, options: Partial<WebAssemblyStartOptions>) : Promise<JSInitializer> {
  const initializers = bootConfig.resources.libraryInitializers;
  const jsInitializer = new JSInitializer();
  if (initializers) {
    var libUrls = Object.keys(initializers);
    if (options && options.loadBootResource) {
      libUrls = libUrls.map(libRelUrl => {
        var urlResult = options.loadBootResource("libraryInitializers", libRelUrl, libRelUrl, "");
        if ("string" == typeof urlResult)
          return urlResult;
        else if (urlResult)
          throw new Error(`For a 'libraryInitializers' (${libRelUrl}) resource, custom loaders must supply a URI string.`)
        return libRelUrl;
      });
    }
    await jsInitializer.importInitializersAsync(libUrls, []);
  }

  return jsInitializer;
}
