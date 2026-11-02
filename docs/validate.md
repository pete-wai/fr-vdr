# Validate a file

Choose a completed JSON or CSV file, or load an example. Your browser checks the file locally without uploading or saving its contents. Use the command-line validator below for files larger than 5 MB.

<div id="validator" class="validator">
  <label for="submission-file">JSON or CSV file</label>
  <input id="submission-file" type="file" accept=".json,.csv,application/json,text/csv">
  <div class="validator-row">
    <div>
      <label for="example">Example</label>
      <select id="example">
        <option value="automated.json">Aster — JSON</option>
        <option value="automated.csv">Aster — CSV</option>
        <option value="legacy.json">Harbor — JSON</option>
        <option value="legacy.csv">Harbor — CSV</option>
        <option value="availability.json">Smallbrook — JSON</option>
        <option value="availability.csv">Smallbrook — CSV</option>
      </select>
    </div>
    <button id="load-example" type="button">Load example</button>
    <a id="download-example" href="downloads/automated.json" download>Download example</a>
  </div>
  <label for="format">File format</label>
  <select id="format"><option value="json">JSON</option><option value="csv">CSV</option></select>
  <label for="submission-text">File contents — you can also paste or edit here</label>
  <textarea id="submission-text" rows="12" spellcheck="false" aria-describedby="text-help"></textarea>
  <p id="text-help">The selected file stays on your device. Editing here does not change the original file.</p>
  <button id="run-validation" type="button">Validate</button>
  <p id="validation-summary" role="status" aria-live="polite">Choose a file or load an example to begin.</p>
  <ul id="validation-errors"></ul>
</div>

<noscript>Enable JavaScript to use the browser validator, or use the command-line instructions below.</noscript>

Use the rule and field names in each error to find the answer that needs fixing. CSV row numbers include the header; line breaks inside a quoted cell do not create extra rows. If you choose **Not Applicable** for a rule that normally applies, the validator asks a reviewer to check your explanation.

The validator checks required answers, dates, statuses, duplicate or missing rules, and offering metadata. It cannot tell whether your implementation works or your explanation is adequate. See [what passing validation means](faq.md#does-passing-this-validator-mean-we-meet-the-rules).

## Command line

After following the repository’s [setup instructions](https://github.com/pete-wai/fr-vdr#local-use):

```sh
mise exec -- npm run validate -- your-file.json
mise exec -- npm run validate -- your-file.csv
```

Exit status is `0` for a valid file, `1` for validation errors, and `2` for file or usage errors. No data is sent to a server.
