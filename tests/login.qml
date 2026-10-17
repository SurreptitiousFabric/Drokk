import QtQuick
import QtTest

Item {
    width: 500; height: 450
    LoginForm {
        id: form; initialUser: "fixture-user"
        sessions: ListModel { ListElement { name: "Hyprland" } }
    }
    SignalSpy { id: requested; target: form; signalName: "loginRequested" }
    TestCase {
        name: "MegaCityOneLogin"; when: windowShown
        function test_submitAndFailure() {
            var password = findChild(form, "password")
            password.text = "fixture-input"
            form.submit()
            compare(requested.count, 1)
            verify(form.busy)
            compare(password.text, "")
            form.submit()
            compare(requested.count, 1)
            form.rejectLogin()
            verify(!form.busy)
            verify(form.failureMessage.length > 0)
            compare(password.text, "")
            verify(password.activeFocus)
        }
    }
}
