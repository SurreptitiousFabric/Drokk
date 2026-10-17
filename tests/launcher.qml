import QtQuick
import QtTest
import "."

Item {
    width: 500; height: 500
    QtObject {
        id: library
        property string launched: ""
        property var entries: [
            { id: "terminal", categories: ["TerminalEmulator"], name: "Terminal", icon: "download" },
            { id: "files", categories: ["FileManager"], name: "Files", icon: "success" },
            { id: "browser", categories: ["WebBrowser"], name: "Browser", icon: "info" },
            { id: "editor", categories: ["TextEditor"], name: "Editor", icon: "warning" },
            { id: "settings", categories: ["Settings"], name: "Settings", icon: "error" },
            { id: "monitor", name: "System Monitor", icon: "info" },
            { id: "viewer", name: "Document Viewer", icon: "info" }
        ]
        signal appsChanged()
        function sortedEntries(query) {
            return entries.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).map(e => ({ entry: e }))
        }
        function entryName(entry) { return entry.name }
        function iconSource(icon) { return "icons/search.svg" }
        function launch(id, name) { launched = id }
    }
    LauncherCard {
        id: card
        x: 20; y: 20
        width: implicitWidth; height: implicitHeight
        appLibrary: library
    }
    SignalSpy { id: closed; target: card; signalName: "closeRequested" }
    TestCase {
        name: "MegaCityOneLauncher"
        when: windowShown
        function init() { card.open(); library.launched = ""; closed.clear() }
        function test_searchAndLaunch() {
            for (const letter of "browser") keyClick(letter)
            compare(card.rows.length, 1)
            keyClick(Qt.Key_Return)
            compare(library.launched, "browser")
            compare(closed.count, 1)
        }
        function test_navigationAndEscape() {
            keyClick(Qt.Key_PageDown)
            compare(card.selectedIndex, 5)
            keyClick(Qt.Key_Down)
            compare(card.selectedIndex, 6)
            keyClick(Qt.Key_Return)
            compare(library.launched, "viewer")
            card.open()
            keyClick(Qt.Key_Escape)
            compare(closed.count, 2)
        }
        function test_emptyResults() {
            for (const letter of "zzzz") keyClick(letter)
            compare(card.rows.length, 0)
            keyClick(Qt.Key_Return)
            compare(library.launched, "")
            compare(closed.count, 0)
        }
        function test_mouseSelection() {
            mouseClick(card, 130, 130)
            compare(library.launched, "files")
            compare(closed.count, 1)
        }
        function test_capture() {
            wait(50)
            grabImage(card).save("launcher.png")
        }
    }
}
