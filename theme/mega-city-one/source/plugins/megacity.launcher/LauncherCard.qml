import QtQuick

Rectangle {
    id: root
    property var appLibrary: null
    property color selectedBackground: @@color:shell.menu.selected-background@@
    property var rows: []
    property int selectedIndex: 0
    readonly property alias query: search.text
    signal closeRequested()
    signal settingsRequested()
    implicitWidth: 360
    implicitHeight: 344
    radius: 10
    color: Qt.alpha(@@color:shell.menu.background@@, @@alpha:shell.menu.background-alpha@@)
    border.width: 1
    border.color: @@color:shell.menu.border@@

    function refresh() {
        const available = appLibrary ? appLibrary.sortedEntries(search.text) : []
        const ordered = [], used = {}
        if (!search.text && appLibrary) {
            for (const role of ["terminal", "files", "browser", "editor", "settings"]) {
                const match = available.find(row => roleFor(row.entry) === role && !used[row.entry.id])
                if (match) { ordered.push(match); used[match.entry.id] = true }
                else if (role === "settings") ordered.push({ entry: { id: "", name: "Settings" }, settingsAction: true })
            }
        }
        rows = ordered.concat(available.filter(row => !used[row.entry.id]))
        selectedIndex = 0
        list.positionViewAtBeginning()
    }
    function open() {
        search.text = ""
        refresh()
        search.forceActiveFocus()
    }
    function moveSelection(delta) {
        if (rows.length === 0) return
        selectedIndex = Math.max(0, Math.min(rows.length - 1, selectedIndex + delta))
        list.positionViewAtIndex(selectedIndex, ListView.Contain)
    }
    function activate(index) {
        if (!appLibrary || index < 0 || index >= rows.length) return
        if (rows[index].settingsAction) { settingsRequested(); return }
        const entry = rows[index].entry
        if (!entry || !entry.id) return
        appLibrary.launch(String(entry.id), appLibrary.entryName(entry))
        closeRequested()
    }
    function roleFor(entry) {
        const categories = entry.categories || []
        const roles = { TerminalEmulator: "terminal", FileManager: "files", WebBrowser: "browser", TextEditor: "editor", Settings: "settings" }
        for (const category of Object.keys(roles)) if (categories.indexOf(category) >= 0) return roles[category]
        return ""
    }
    onAppLibraryChanged: refresh()
    Connections {
        target: root.appLibrary
        function onAppsChanged() { root.refresh() }
    }
    MouseArea { anchors.fill: parent; onClicked: search.forceActiveFocus() }
    Image {
        x: 20; y: 19; width: 20; height: 20
        source: "icons/search.svg"
    }
    TextInput {
        id: search
        objectName: "search"
        x: 52; y: 17; width: parent.width - 72; height: 28
        color: @@color:shell.menu.text@@
        selectionColor: root.selectedBackground
        selectedTextColor: @@color:shell.menu.selected-text@@
        font.family: @@font:interface@@
        font.pixelSize: 16
        clip: true
        selectByMouse: true
        onTextChanged: root.refresh()
        Keys.onPressed: event => {
            if (event.key === Qt.Key_Down) root.moveSelection(1)
            else if (event.key === Qt.Key_Up) root.moveSelection(-1)
            else if (event.key === Qt.Key_PageDown) root.moveSelection(5)
            else if (event.key === Qt.Key_PageUp) root.moveSelection(-5)
            else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) root.activate(root.selectedIndex)
            else if (event.key === Qt.Key_Escape) root.closeRequested()
            else return
            event.accepted = true
        }
    }
    ListView {
        id: list
        x: 10; y: 58; width: parent.width - 20; height: Math.min(248, parent.height - y - 10)
        clip: true
        spacing: 7
        model: root.rows
        boundsBehavior: Flickable.StopAtBounds
        delegate: Rectangle {
            id: row
            required property var modelData
            required property int index
            readonly property var entry: modelData.entry
            readonly property string role: modelData.settingsAction ? "settings" : root.roleFor(entry)
            readonly property bool selected: index === root.selectedIndex
            width: list.width; height: 44; radius: 5
            color: selected ? root.selectedBackground : "transparent"
            Rectangle {
                width: 3; height: parent.height - 4; y: 2
                radius: 1
                visible: row.selected
                color: @@color:shell.menu.selected-border@@
            }
            Rectangle {
                x: 20; anchors.verticalCenter: parent.verticalCenter
                width: 24; height: 24; radius: 3
                visible: row.role === "terminal" && row.selected
                color: @@color:background@@
            }
            Image {
                x: 20; anchors.verticalCenter: parent.verticalCenter
                width: 24; height: 24
                source: row.role ? Qt.resolvedUrl("icons/" + row.role + (row.selected ? "-selected" : "-idle") + ".svg")
                    : root.appLibrary ? root.appLibrary.iconSource(String(row.entry.icon || "")) : ""
                fillMode: Image.PreserveAspectFit
            }
            Text {
                x: 60; width: parent.width - x - 12
                anchors.verticalCenter: parent.verticalCenter
                text: !root.query && row.role ? ({terminal:"Terminal",files:"Files",browser:"Browser",editor:"Editor",settings:"Settings"})[row.role]
                    : root.appLibrary ? root.appLibrary.entryName(row.entry) : ""
                textFormat: Text.PlainText
                color: row.selected ? @@color:shell.menu.selected-text@@ : @@color:shell.menu.text@@
                font.family: @@font:interface@@
                font.pixelSize: 16
                elide: Text.ElideRight
            }
            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                onPositionChanged: root.selectedIndex = row.index
                onClicked: root.activate(row.index)
            }
        }
    }
    Text {
        x: 20; y: 70; width: parent.width - 40
        visible: root.rows.length === 0
        text: root.appLibrary ? "No applications found" : "Application library unavailable"
        textFormat: Text.PlainText
        color: @@color:muted@@
        font.family: @@font:interface@@
        font.pixelSize: 16
        wrapMode: Text.Wrap
    }
}
