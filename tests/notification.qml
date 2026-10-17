import QtQuick
import QtTest
import "."

Item {
    id: fixture
    width: 480; height: 640
    NotificationCard {
        id: card
        x: 20; y: 20
        width: implicitWidth; height: implicitHeight
        appIcon: "megacity-download"
        summary: "Download complete"
        body: "sector-report.pdf is ready."
        actionLabel: "Open folder"
    }
    SignalSpy { id: dismiss; target: card; signalName: "closeRequested" }
    SignalSpy { id: invoke; target: card; signalName: "cardClicked" }
    TestCase {
        name: "MegaCityOneNotification"
        when: windowShown
        function test_appearanceCapture() {
            wait(50)
            grabImage(card).save("notification-download.png")
        }
        function test_categories() {
            card.appIcon = ""; card.image = ""
            card.category = "transfer.complete"; compare(card.kind, "download")
            card.category = "network.connected"; compare(card.kind, "success")
            card.category = "device.battery.low"; compare(card.kind, "error"); compare(card.tileSymbol, "battery-error")
            compare(card.tileColor.toString(), "#d3404b")
            card.category = "unrecognised"; compare(card.kind, "info")
            card.category = ""; card.appIcon = "megacity-download"
        }
        function test_hover() {
            mouseMove(card, 10, 10); wait(20); verify(card.hovered)
            mouseMove(fixture, 450, 180); wait(20); verify(!card.hovered)
        }
        function test_controls() {
            compare(card.height, 116)
            mouseClick(card, 358, 22)
            compare(dismiss.count, 1)
            compare(invoke.count, 0)
            mouseClick(card, 130, 82)
            compare(invoke.count, 1)
            compare(dismiss.count, 1)
            mouseClick(card, 45, 45, Qt.RightButton)
            compare(dismiss.count, 2)
        }
        function test_longContent() {
            card.actionLabel = ""
            card.summary = "A long notification title that must wrap without covering the dismiss control"
            card.body = "A long message from an application. ".repeat(20)
            wait(50)
            verify(card.height > 116)
            card.urgency = 2
            compare(card.effectiveKind, "error")
            compare(card.tileColor.toString(), "#d3404b")
        }
        function test_providerMarker() {
            card.urgency = 1
            card.appIcon = ""
            card.image = "image://icon/megacity-success"
            compare(card.kind, "success")
            compare(card.tileColor.toString(), "#9edb84")
        }
    }
}
