/*!
 * Copyright 2024, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import SelectChannel from "./components/config/SelectChannel";
import ProblematicSelectExample from "./components/config/ProblematicSelectExample";

// Configuration properties
const baseProperties: { [key: string]: JSONSchema7Definition } = {
  channel: {
    type: "string" as const,
    title: "Channel",
  },
};

// Add problematic example only if enabled
if (process.env.REACT_APP_ENABLE_PROBLEMATIC_SELECT_EXAMPLE === "true") {
  baseProperties.problematicExample = {
    type: "string" as const,
    title: "Problematic Example",
    description: "This is an example that demonstrates issues with React hooks",
  };
}

/**
 * schema used for generation of the configuration dialog
 * see https://rjsf-team.github.io/react-jsonschema-form/docs/ for documentation
 */
export const configurationSchema: JSONSchema7 = {
  type: "object",
  properties: baseProperties,
  required: process.env.REACT_APP_ENABLE_PROBLEMATIC_SELECT_EXAMPLE === "true"
    ? ["channel", "problematicExample"]
    : ["channel"],
};

// Base UI Schema
const baseUiSchema: UiSchema = {
  channel: {
    "ui:widget": SelectChannel,
    "ui:help": "Select the channel to display the content",
  },
};

// Add problematic example UI schema if enabled
if (process.env.REACT_APP_ENABLE_PROBLEMATIC_SELECT_EXAMPLE === "true") {
  baseUiSchema.problematicExample = {
    "ui:widget": ProblematicSelectExample,
    "ui:help": "This widget demonstrates problematic patterns with React hooks",
  };
}

/**
 * schema to add more customization to the form's look and feel
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = baseUiSchema;
