import React from "react"
import {screen, render} from "@testing-library/react"

import {StaffbaseExampleRenderWidget} from "./staffbase-example-render-widget";

describe("StaffbaseExampleRenderWidget", () => {
    it("should render the component", () => {
        render(<StaffbaseExampleRenderWidget contentLanguage="en_US" channel="679a3e8122f1d760e63ef502"/>);

        expect(screen.getByText(/Articles/)).toBeInTheDocument();
    })
})
