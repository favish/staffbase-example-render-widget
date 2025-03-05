import React from "react";
import { WidgetProps } from "@rjsf/utils";
import "./ProblematicSelectExample.css";

/**
 * This is an example component that demonstrates problematic patterns
 * with React hooks that might cause rendering issues in the widget configuration
 */
function ProblematicSelectExample({
  id,
  value,
  onChange,
  readonly,
  disabled,
}: WidgetProps) {
  // Using React.useState to ensure proper context
  const [internalOptions, setInternalOptions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedValue, setSelectedValue] = React.useState(value || "");

  // Ref that might cause issues with widget rendering
  const mountCountRef = React.useRef(0);

  // Problematic useEffect with multiple dependencies
  React.useEffect(() => {
    mountCountRef.current += 1;
    console.log(`Component mounted ${mountCountRef.current} times`);

    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulating an API call that might cause issues
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInternalOptions(["Option 1", "Option 2", "Option 3"]);
        setError(null);
      } catch {
        setError("Failed to fetch options");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function that might not execute properly
    return () => {
      console.log("Cleanup executed");
      setInternalOptions([]);
      setLoading(true);
    };
  }, [selectedValue]); // Dependency on selectedValue might cause infinite loops

  // Another problematic useEffect
  React.useEffect(() => {
    if (selectedValue) {
      // This might cause unnecessary re-renders
      setInternalOptions(prev => [...prev, `New Option ${prev.length + 1}`]);
    }
  }, [selectedValue]);

  // Sync with external value
  React.useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  return (
    <div className="select-container">
      {loading && (
        <div className="loading">
          Loading available options...
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <select
        id={id}
        value={selectedValue}
        onChange={handleChange}
        className="select-input"
        disabled={disabled || readonly || loading}
      >
        <option value="">Please select an option</option>
        {internalOptions.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="mount-count">
        Component mounted: {mountCountRef.current} times
      </div>
    </div>
  );
}

// Ensure the component is recognized as a widget
ProblematicSelectExample.displayName = "ProblematicSelectExample";

export default ProblematicSelectExample;