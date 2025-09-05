# SecureWipe Pro v2.1.0

A comprehensive tool for secure data wiping, verification, and certificate generation for Windows PCs and Android devices.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features

- Detect connected drives, USBs, and Android devices.
- Safe demo wipe and full destructive wipe options.
- Verification tests:
  - Surface scan
  - Deep sector analysis
  - Challenge-write test
  - Magnetic residue check
- Generate wipe certificates in JSON and PDF formats.
- Dark/light mode support.
- Real-time logs and help section.

---

## Installation

1. Clone the repository:
   git clone https://github.com/Ctrshivu/ONE-CLICK-SECURE-WIPE.git

2- Navigate into the project folder:
cd ONE-CLICK-SECURE-WIPE

3- install dependencies
npm install

4- Run the DEvelopment server
npm run dev

## Usage

- Devices are detected automatically.
- Select a device from the list.
- Run a Safe Wipe or Full Destructive Wipe.
- Verify wipe completion with the verification tests.
- Generate a certificate for the wiped device(s).
- Download the certificate as JSON or PDF.

## Built With

React + TypeScript
Tailwind CSS
Lucide Icons
Custom UI components for Cards, Buttons, Progress, Dialogs, and Scroll areas.

## Author / Team

Team Name: Lazy Debuggers
Author: Sanjay Kumar Sutar (Lead Developer)

## Notes

Demo mode does not modify real data.

Make sure to select the correct device before running a full wipe.

JSON and PDF certificates are generated for audit purposes.
