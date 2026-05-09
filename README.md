# CS 8803/4803 Computer Graphics in AI Era Starter Code

Welcome to the CGAI starter code repository! This README provides step-by-step instructions for running your first WebGL graphics demo by installing Node.js, npm, as well as setting up a Next.js project. Follow the instructions for your operating system to get started.

You can find additional tutorial videos for how to set up the starter code the Assignment 1 page in Canvas.

---

## Prerequisites

1. **Basic Requirements**:
   - A computer running macOS, Windows, or Linux.
   - A git system on your computer (read the git tutorial links from our Canvas mainpage if you are unfamiliar with using git).
2. **Programming IDE**:
   - A programming IDE or text editor (we recommand using [Visual Studio Code](https://code.visualstudio.com/).

---

## Installing Node.js and npm

Node.js is a JavaScript runtime, and npm (Node Package Manager) comes with it. You’ll need both to work with React/Next.js projects.

### macOS

1. **Install Homebrew (if not already installed)**:
   Open Terminal and run:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**:
   Using Homebrew, run:

   ```bash
   brew install node
   ```

   This will install both Node.js and npm.

3. **Verify Installation**:
   - Check Node.js version:

     ```bash
     node -v
     ```

   - Check npm version:

     ```bash
     npm -v
     ```

### Windows

1. **Download Node.js**:
   - Visit [Node.js Downloads](https://nodejs.org/).
   - Download the **LTS** version (recommended for most users).

2. **Run the Installer**:
   - Double-click the downloaded file and follow the installation wizard.
   - Ensure that you check the box to add Node.js to the system PATH.

3. **Verify Installation**:
   - Open Command Prompt or PowerShell.
   - Check Node.js version:

     ```bash
     node -v
     ```

   - Check npm version:

     ```bash
     npm -v
     ```
     (When running npm, make sure to turn on the running scripts policy. If your terminal shows an error of "npm.psl cannot be loaded because running scripts is disabled on this system...," run the following command as the administrator in PowerShell: "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass" and then run the npm command again)

### Linux

1. **Install Node.js using NodeSource**:
   - Open your terminal.
   - Run the following commands to add the NodeSource repository and install Node.js:

     ```bash
     curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

2. **Install Build Tools (optional but recommended)**:
   - For compiling native modules, install build-essential:

     ```bash
     sudo apt-get install -y build-essential
     ```

3. **Verify Installation**:
   - Check Node.js version:

     ```bash
     node -v
     ```

   - Check npm version:

     ```bash
     npm -v
     ```

---

## Running the CGAI starter code

After installing node.js and npm, we are ready to download the source code and setup our first demo:

1. Clone the starter code to your computer:
   ```bash
   git clone https://github.com/cg-gatech/cgai.git
   ```
   
2. Install dev dependencies under your cgai starter code folder:

   ```bash
   cd cgai
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and go to: `http://localhost:3000` (The port number may change due to your local machine. You may also choose to click the URL in your command line. You should see the class landing page).
   ![image](https://github.com/user-attachments/assets/d741e304-5bc9-4aa9-9830-1bf60c9114a2)

5. After you have completed the assignment, for example, Assignment 1, you can click on the link named `Assignment 1` under the `Assignments` section. Or, You can just go to `http://localhost:3000/assignment/a1` to see the result of the assignment.

---

## Additional Documents:

Read these documents if you are interested in the technical details behind these frameworks. 

- [Next.js](https://nextjs.org/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Three.js](https://threejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShaderToy](https://www.shadertoy.com/)

---

## VSCode Extensions

You may find the following VSCode extensions helpful:

- [WebGL GLSL Editor](https://marketplace.visualstudio.com/items?itemName=raczzalan.webgl-glsl-editor)
- [Shader languages support for VS Code](https://marketplace.visualstudio.com/items?itemName=slevesque.shader)
