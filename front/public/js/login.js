const request = axios.create({
    baseURL: "http://127.0.0.1:3000",
    withCredentials: true,
})

const signUpButton = document.getElementById("signUp")
const signInButton = document.getElementById("signIn")
const container = document.getElementById("container")
const input = document.querySelector("#userinfo > label > input")
const form = document.querySelector("#form")
const idCheck = document.querySelector("input[name='userId']")
const idOverlap = document.querySelector("label>p")
const idFocus = document.querySelector("input[name='userPw']")

const nickCheck = document.querySelector("input[name='nickName']")
// const nickOverlap = document.querySelector()

idCheck.addEventListener("input", async (e) => {
    const userid = idCheck.value
    const response = await request.post(
        "/user/check",
        {
            userid,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const { data } = response
    if (data) {
        idOverlap.innerHTML = "중복된 아이디가 존재합니다."
        idOverlap.style.display = "block"
    } else {
        idOverlap.innerHTML = ""
        idOverlap.style.display = "none"
    }
})

idFocus.addEventListener("focus", (e) => {
    if (idOverlap.innerHTML) {
        alert("아이디 중복값을 확인해주세요")
        idCheck.focus()
    }
})

form.addEventListener("submit", async (e) => {
    try {
        e.preventDefault()
        const { userId, userPw } = e.target

        const response = await request.post("/auth", {
            userId: userId.value,
            userPw: userPw.value,
        })

        if (response.status === 200) {
            document.cookie = `token=${response.data.token};path=/`
            console.log(document.cookie)
            location.href = "/"
        }
    } catch (e) {
        alert("아이디와 패스워드가 다름")
    }
})

signUpButton.addEventListener("click", () => container.classList.add("right-panel-active"))
signInButton.addEventListener("click", () => container.classList.remove("right-panel-active"))
