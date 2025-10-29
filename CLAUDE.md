# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# React Native Survey App - Development Guide

## Project Overview

This is a cross-platform mobile application (React Native) designed to invite users to participate in surveys. The app serves as a native wrapper around web-based surveys with the following core functionality:

- **Authentication**: Phone number + OTP verification
- **Survey Discovery**: List of available surveys from backend API
- **Survey Participation**: WebView integration to display external survey web applications
- **Push Notifications**: Notify users about new available surveys
- **Cross-Platform**: Single codebase targeting both Android and iOS (Android-first development)

The app is essentially a sophisticated browser wrapper that provides native mobile features (push notifications, authentication) while leveraging existing web survey infrastructure.

## Task Management System

### tasks/todo.md is the TASK BIBLE
- **ALL development must follow the task list in `tasks/todo.md`**
- Tasks are sequential with dependencies - NEVER skip to next task until current is complete
- Each task has detailed acceptance criteria and testing requirements
- Tasks include specific API endpoints needed from backend team
- Update task status in todo.md as work progresses

### Task Rules (STRICTLY ENFORCED)
1. **Never move to next task** until current task passes ALL tests
2. **Always write tests first** or alongside implementation
3. **Stick to architectural plan** - no "cool" additional features without approval
4. **Ask for help** if blocked, confused, or need clarification
5. **Focus only on current task** - avoid scope creep

## Memories
- Always update the todo.md with tasks updates, what is done or what task should be changed or moved.

[Rest of the existing content remains the same...]