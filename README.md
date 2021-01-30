# KristianFJones/TS-AutoNetwork

This is a module created for the ISP I work at [K-Net](https://github.com/knetca), it's a custom build [IP Address Management (IPAM)](https://en.wikipedia.org/wiki/IP_address_management) system that is stored as a [YAML](https://en.wikipedia.org/wiki/YAML#:~:text=YAML%20(a%20recursive%20acronym%20for,is%20being%20stored%20or%20transmitted.) file.

## IPAM YAML File

The IPAM YAML defines the following arrays

- Communities each site within a community, and the devices at each site.

- Circuits the unique ID for referencing within network prefixes, the sideA and sizeZ include the ID which is a refernce to a "circuitLocation", and the speed of the "EVC"

- Circuit Locations which is what "circuit providers" think of as the circuit, which includes the circuit provider, the circuit ID that is referenced in "circuits", the address that is provided to the circuit provider, the phyiscal demarc speed.

- Networks, which has a prefix or "network", and can optionally have: a circuit id reference attached, a nsServer array contianing the authoritive nsServers for forwarding reverse DNS, contactId referencing a contact, or children networks.

- Contacts, which are currently unused, but will contain the name, email, and contact information for staff and for automated systems such as processing abuse emails.

## Usage

On the GitHub Website click "Use this template"

Once you have cloned the template locally search and replace and usage of TS-Core with the name of your new project

## Development

### Setting up the development container

Follow these steps to open this project in a container:

1. If this is your first time using a development container, please follow the [getting started steps](https://aka.ms/vscode-remote/containers/getting-started).

2. To use this repository, you can either open the repository in an isolated Docker volume:

   - Press <kbd>F1</kbd> and select the **Remote-Containers: Open Repository in Container...** command.
   - Enter `KristianFJones/TS-AutoNetwork`
   - The VS Code window (instance) will reload, clone the source code, and start building the dev container. A progress notification provides status updates.

   Or open a locally cloned copy of the code:

   - Clone this repository to your local filesystem.
     - `git clone https://github.com/KristianFJones/TS-AutoNetwork.git`
   - Open the project folder in Visual Studio Code.
     - `code ./TS-AutoNetwork`
   - Reopen in Container

     - When you open the project folder in Visual Studio Code you should be prompted with a notification asking if you would like to reopen in container.

     Or manually reopen

     - Press F1 and select the "Remote-Containers: Open Folder in Container..." command.

### Running

Open a VSCode Terminal

```
npm run dev
```

Or launch with the VSCode Debugging tab
