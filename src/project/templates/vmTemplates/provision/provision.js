const template = `\
---
- hosts: all
  become: yes
  vars:
    EXAMPLE_VARIABLE: "42"
    ANOTHER_EXAMPLE_VARIABLE: "text"
  tasks:
    - name: Display the config
      copy:
        content: "The EXAMPLE_VARIABLE is {{ EXAMPLE_VARIABLE }} and the ANOTHER_EXAMPLE_VARIABLE is {{ ANOTHER_EXAMPLE_VARIABLE }}"
        dest: "/home/vagrant/helloworld.txt"
`;

export default template;
