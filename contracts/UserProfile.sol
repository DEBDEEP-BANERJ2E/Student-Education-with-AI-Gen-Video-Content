// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract UserProfile is Ownable {
    struct PersonalInfo {
        string name;
        uint8 age;
        string location;
        string gender;
        string workEnvironment; // Remote/Hybrid/In-office
        uint256 lastUpdated;
    }

    struct Education {
        string degree;
        string institution;
        uint16 graduationYear;
        string specialization;
        string[] certifications;
        uint256 lastUpdated;
    }

    struct WorkExperience {
        string jobTitle;
        string company;
        string industry;
        uint256 startDate;
        uint256 endDate;
        string[] responsibilities;
        uint256 lastUpdated;
    }

    struct Project {
        string title;
        string description;
        string[] technologies;
        string role;
        uint256 startDate;
        uint256 endDate;
        address issuer;
        bool verified;
        uint256 lastUpdated;
    }

    struct Skills {
        string[] technical;
        string[] soft;
        string[] languages;
        uint256 lastUpdated;
    }

    struct Profile {
        PersonalInfo personalInfo;
        Education[] education;
        WorkExperience[] workExperience;
        Project[] projects;
        Skills skills;
        bool isActive;
        uint256 createdAt;
        uint256 lastUpdated;
    }

    mapping(address => Profile) public profiles;
    mapping(address => bool) public verifiedIssuers;

    uint256 public profileUpdateFee = 0.00001 ether; // Updated to 0.00001 EDU
    
    event ProfileCreated(address indexed user, uint256 timestamp);
    event ProfileUpdated(address indexed user, uint256 timestamp);
    event ProjectAdded(address indexed user, string title, address issuer);
    event ProjectCompleted(address indexed user, string title, address issuer);
    event IssuerVerified(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    modifier onlyVerifiedIssuer() {
        require(verifiedIssuers[msg.sender], "Not a verified issuer");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createProfile(
        string memory _name,
        uint8 _age,
        string memory _location,
        string memory _gender,
        string memory _workEnvironment
    ) external payable {
        require(msg.value >= profileUpdateFee, "Insufficient fee");
        require(!profiles[msg.sender].isActive, "Profile already exists");

        PersonalInfo memory personalInfo = PersonalInfo({
            name: _name,
            age: _age,
            location: _location,
            gender: _gender,
            workEnvironment: _workEnvironment,
            lastUpdated: block.timestamp
        });

        profiles[msg.sender].personalInfo = personalInfo;
        profiles[msg.sender].isActive = true;
        profiles[msg.sender].createdAt = block.timestamp;
        profiles[msg.sender].lastUpdated = block.timestamp;

        emit ProfileCreated(msg.sender, block.timestamp);
    }

    function updatePersonalInfo(
        string memory _name,
        uint8 _age,
        string memory _location,
        string memory _gender,
        string memory _workEnvironment
    ) external payable {
        require(msg.value >= profileUpdateFee, "Insufficient fee");
        require(profiles[msg.sender].isActive, "Profile does not exist");

        profiles[msg.sender].personalInfo = PersonalInfo({
            name: _name,
            age: _age,
            location: _location,
            gender: _gender,
            workEnvironment: _workEnvironment,
            lastUpdated: block.timestamp
        });

        profiles[msg.sender].lastUpdated = block.timestamp;
        emit ProfileUpdated(msg.sender, block.timestamp);
    }

    function addEducation(
        string memory _degree,
        string memory _institution,
        uint16 _graduationYear,
        string memory _specialization,
        string[] memory _certifications
    ) external payable {
        require(msg.value >= profileUpdateFee, "Insufficient fee");
        require(profiles[msg.sender].isActive, "Profile does not exist");

        Education memory newEducation = Education({
            degree: _degree,
            institution: _institution,
            graduationYear: _graduationYear,
            specialization: _specialization,
            certifications: _certifications,
            lastUpdated: block.timestamp
        });

        profiles[msg.sender].education.push(newEducation);
        profiles[msg.sender].lastUpdated = block.timestamp;
        emit ProfileUpdated(msg.sender, block.timestamp);
    }

    function addProject(
        address _user,
        string memory _title,
        string memory _description,
        string[] memory _technologies,
        string memory _role
    ) external payable onlyVerifiedIssuer {
        require(msg.value >= profileUpdateFee, "Insufficient fee");
        require(profiles[_user].isActive, "User profile does not exist");

        Project memory newProject = Project({
            title: _title,
            description: _description,
            technologies: _technologies,
            role: _role,
            startDate: block.timestamp,
            endDate: 0,
            issuer: msg.sender,
            verified: true,
            lastUpdated: block.timestamp
        });

        profiles[_user].projects.push(newProject);
        profiles[_user].lastUpdated = block.timestamp;
        emit ProjectAdded(_user, _title, msg.sender);
    }

    function completeProject(
        address _user,
        uint256 _projectIndex
    ) external payable onlyVerifiedIssuer {
        require(msg.value >= profileUpdateFee, "Insufficient fee");
        require(profiles[_user].isActive, "User profile does not exist");
        require(_projectIndex < profiles[_user].projects.length, "Invalid project index");
        require(profiles[_user].projects[_projectIndex].issuer == msg.sender, "Not the project issuer");
        require(profiles[_user].projects[_projectIndex].endDate == 0, "Project already completed");

        profiles[_user].projects[_projectIndex].endDate = block.timestamp;
        profiles[_user].projects[_projectIndex].lastUpdated = block.timestamp;
        profiles[_user].lastUpdated = block.timestamp;

        emit ProjectCompleted(_user, profiles[_user].projects[_projectIndex].title, msg.sender);
    }

    function updateSkills(
        string[] memory _technical,
        string[] memory _soft,
        string[] memory _languages
    ) external payable {
        require(msg.value >= profileUpdateFee, "Insufficient fee");
        require(profiles[msg.sender].isActive, "Profile does not exist");

        profiles[msg.sender].skills = Skills({
            technical: _technical,
            soft: _soft,
            languages: _languages,
            lastUpdated: block.timestamp
        });

        profiles[msg.sender].lastUpdated = block.timestamp;
        emit ProfileUpdated(msg.sender, block.timestamp);
    }

    function addVerifiedIssuer(address _issuer) external onlyOwner {
        verifiedIssuers[_issuer] = true;
        emit IssuerVerified(_issuer);
    }

    function removeVerifiedIssuer(address _issuer) external onlyOwner {
        verifiedIssuers[_issuer] = false;
        emit IssuerRemoved(_issuer);
    }

    function updateProfileUpdateFee(uint256 _newFee) external onlyOwner {
        profileUpdateFee = _newFee;
    }

    function withdrawFees() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}