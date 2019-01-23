'use strict'

/**
* Asterism plugin library
* The root of the package is a module that exports all its components, nothing more.
* So you can use one of its component importing it in a destructuring way:
* @example
* import { IconPicker, CollectionSetting } from "asterism-plugin-library"
*
* @module asterism-plugin-library
*/

export { default as ActionColorSwitch } from './action-color-switch'
export { default as AdditionalItem } from './additional-item'
export { default as IconPicker } from './icon-picker'
export { default as Item } from './item'
export { default as ItemFactoryBuilder } from './item-factory-builder'
export { default as ItemSettingPanel } from './item-setting-panel'
export { default as CollectionSetting } from './collection-setting'
export { default as Scenarii } from './scenarii'
