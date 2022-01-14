const template = `\
---
- hosts: all
  become: yes
  tasks:
    - name: Changing mirrors
      replace:
        path: /etc/apt/sources.list
        regexp: 'http://archive.ubuntu.com/ubuntu'
        replace: 'http://ru.archive.ubuntu.com/ubuntu'
        backup: yes

    - name: Full system upgrade
      become: yes
      apt:
        update_cache: yes
        upgrade: yes

    - name: Install CLI apps and libraries
      apt:
        name:
          - build-essential
          - software-properties-common
          - make
          - htop
          - iotop
          - rsync
          - atop
        state: latest

    - name: Atop configuration
      replace:
        path: /usr/share/atop/atop.daily
        regexp: 'INTERVAL=\\d+'
        replace: 'INTERVAL=1'
        backup: yes

    - name: Restart Atop service, in all cases
      service:
        name: atop
        state: restarted
`;

export default template;
