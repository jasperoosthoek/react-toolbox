// Comprehensive examples for localization system

import { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Badge, ButtonGroup, Table } from 'react-bootstrap';
import { 
  defaultLocalization, 
  defaultLanguages,
  LocalizationStrings,
  LocalizationProvider, 
  useLocalization, 
  AdditionalLocalization,
  FormProvider, 
  FormInput, 
  FormSelect, 
  DataTable,
  DeleteConfirmButton,
  SaveButton,
  EditButton,
  useForm,
} from '../../index';
import { CodeBlock } from './CodeBlock';
import { ExampleSection } from './ExampleSection';
import { FormActions } from './FormExamples';

// Example 1: Basic localization usage
const BasicLocalizationExampleComponent = () => {
  const { lang, languages, setLanguage, text, strings } = useLocalization();

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Language Controls</h6>
            <div>
              <span className="me-2">Current Language:</span>
              <Badge bg="primary">{lang.toUpperCase()}</Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <ButtonGroup className="mb-3">
            {languages.map(language => (
              <Button
                key={language}
                variant={lang === language ? 'primary' : 'outline-primary'}
                onClick={() => setLanguage(language)}
              >
                {defaultLanguages[language] || language}
              </Button>
            ))}
          </ButtonGroup>

          <div className="row">
            <div className="col-md-6">
              <h6>Basic String Examples</h6>
              <div className="mb-2">
                <strong>Save:</strong> {text`save`}
              </div>
              <div className="mb-2">
                <strong>Cancel:</strong> {text`cancel`}
              </div>
              <div className="mb-2">
                <strong>Delete:</strong> {text`delete`}
              </div>
              <div className="mb-2">
                <strong>Search:</strong> {text`search`}
              </div>
              <div className="mb-2">
                <strong>Are you sure?:</strong> {text`are_you_sure`}
              </div>
              <div className="mb-2">
                <strong>Required field:</strong> {text`required_field`}
              </div>
            </div>

            <div className="col-md-6">
              <h6>UI String Examples</h6>
              <div className="mb-2">
                <strong>Login:</strong> {text`login`}
              </div>
              <div className="mb-2">
                <strong>Your email:</strong> {text`your_email`}
              </div>
              <div className="mb-2">
                <strong>Enter password:</strong> {text`enter_password`}
              </div>
              <div className="mb-2">
                <strong>Choose one:</strong> {text`choose_one`}
              </div>
              <div className="mb-2">
                <strong>Number of rows:</strong> {text`number_of_rows`}
              </div>
              <div className="mb-2">
                <strong>No information:</strong> {text`no_information_to_display`}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const BasicLocalizationExample = () => {
  const code = `import React from 'react';
import { ButtonGroup, Button, Badge } from 'react-bootstrap';
import { 
  useLocalization, 
  defaultLanguages 
} from '@jasperoosthoek/react-toolbox';

const MyLocalizationDemo = () => {
  const { lang, languages, setLanguage, text } = useLocalization();

  return (
    <div>
      {/* Language switcher */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <span>Current Language:</span>
        <Badge bg="primary">{lang.toUpperCase()}</Badge>
      </div>
      
      <ButtonGroup className="mb-3">
        {languages.map(language => (
          <Button
            key={language}
            variant={lang === language ? 'primary' : 'outline-primary'}
            onClick={() => setLanguage(language)}
          >
            {defaultLanguages[language] || language}
          </Button>
        ))}
      </ButtonGroup>

      {/* Using localized strings */}
      <div>
        <h3>{text\`save\`}</h3>
        <p>{text\`are_you_sure\`}</p>
        <button>{text\`cancel\`}</button>
        <button>{text\`delete\`}</button>
      </div>
      
      {/* Form strings */}
      <div>
        <label>{text\`your_email\`}</label>
        <input placeholder={text\`enter_email\`} />
        
        <label>{text\`your_password\`}</label>
        <input placeholder={text\`enter_password\`} type="password" />
        
        <button>{text\`login\`}</button>
      </div>
    </div>
  );
};`;

  return (
    <ExampleSection
      title="Basic Localization Usage"
      description="Demonstrate basic localization with built-in strings and the text\`localization_string\` pattern"
      code={code}
      features={['Template String Syntax', 'Built-in Translations', 'Language Switching', 'Default Strings']}
      notes={[
        'Use text\`key\` syntax for clean, readable localization',
        'Built-in support for English, French, and Dutch',
        'Language switching updates all strings automatically',
        'Over 20 common UI strings included by default'
      ]}
    >
      <BasicLocalizationExampleComponent />
    </ExampleSection>
  );
};

// Example 2: Custom localization strings
const CustomLocalizationExampleComponent = () => {
  const { lang, setLanguage, text, setLocalization, textByLang, languages } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Custom String Examples</h6>
            <div className="d-flex align-items-center">
              <span className="me-2">Language:</span>
              <Form.Select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{ width: '150px' }}
              >
                {languages.map(language => (
                  <option key={language} value={language}>
                    {defaultLanguages[language] || language}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>Simple String:</strong>
            <div className="text-success">{text`welcome_message`}</div>
          </div>

          <div className="mb-3">
            <strong>Function with Single Parameter:</strong>
            <div className="text-info">{text`greeting${'John'}`}</div>
          </div>

          <div className="mb-3">
            <strong>Function with Number (Pluralization):</strong>
            <div className="text-warning">{text`user_count${1}`}</div>
            <div className="text-warning">{text`user_count${5}`}</div>
          </div>

          <div className="mb-3">
            <strong>Function with Multiple Parameters:</strong>
            <div className="text-danger">{text`notification${'Error'}${'Something went wrong'}`}</div>
            <div className="text-success">{text`notification${'Success'}${'Operation completed'}`}</div>
          </div>

          <div className="mb-3">
            <strong>Complex Function:</strong>
            <div className="text-primary">{text`product_price${'Premium Plan'}${29.99}`}</div>
            <div className="text-primary">{text`product_price${'Basic Plan'}${9.99}`}</div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export const CustomLocalizationExample = () => {
  const code = `import React, { useState } from 'react';
import { useLocalization } from '@jasperoosthoek/react-toolbox';

const CustomStringsDemo = () => {
  const { text, setLocalization, textByLang } = useLocalization();
  
  // Define custom localization strings
  const customStrings = {
    en: {
      welcome_message: "Welcome to our application!",
      user_count: (count) => \`There \${count === 1 ? 'is' : 'are'} \${count} user\${count === 1 ? '' : 's'} online\`,
      greeting: (name) => \`Hello, \${name}!\`,
      notification: (type, message) => \`\${type}: \${message}\`,
      product_price: (name, price) => \`\${name} costs $\${price.toFixed(2)}\`,
    },
    fr: {
      welcome_message: "Bienvenue dans notre application!",
      user_count: (count) => \`Il y a \${count} utilisateur\${count === 1 ? '' : 's'} en ligne\`,
      greeting: (name) => \`Bonjour, \${name}!\`,
      notification: (type, message) => \`\${type}: \${message}\`,
      product_price: (name, price) => \`\${name} coûte \${price.toFixed(2)}$\`,
    },
    nl: {
      welcome_message: "Welkom bij onze applicatie!",
      user_count: (count) => \`Er \${count === 1 ? 'is' : 'zijn'} \${count} gebruiker\${count === 1 ? '' : 's'} online\`,
      greeting: (name) => \`Hallo, \${name}!\`,
      notification: (type, message) => \`\${type}: \${message}\`,
      product_price: (name, price) => \`\${name} kost €\${price.toFixed(2)}\`,
    },
  };

  // Add custom strings to localization
  React.useEffect(() => {
    setLocalization(customStrings);
  }, []);

  return (
    <div>
      {/* Simple string usage */}
      <h2>{text\`welcome_message\`}</h2>
      
      {/* Function with single parameter */}
      <p>{text\`greeting\${'John'}\`}</p>
      
      {/* Function with number (pluralization) */}
      <p>{text\`user_count\${1}\`}</p>
      <p>{text\`user_count\${5}\`}</p>
      
      {/* Multiple parameters */}
      <div>{text\`notification\${'Error'}\${'Something went wrong'}\`}</div>
      <div>{text\`notification\${'Success'}\${'Operation completed'}\`}</div>
      
      {/* Complex function with multiple types */}
      <div>{text\`product_price\${'Premium Plan'}\${29.99}\`}</div>
      
      {/* Use specific language */}
      <div>{textByLang('fr')\`greeting\${'Marie'}\`}</div>
    </div>
  );
};`;

  return (
    <ExampleSection
      title="Custom Localization Strings"
      description="Add your own localization strings with support for function interpolation and parameters"
      code={code}
      features={['Custom Strings', 'Function Interpolation', 'Multiple Parameters', 'Pluralization']}
      notes={[
        'Define custom strings with setLocalization()',
        'Functions can accept multiple parameters for dynamic content',
        'Perfect for pluralization and complex string formatting',
        'Use textByLang() to get strings for specific languages'
      ]}
    >
      <CustomLocalizationExampleComponent />
    </ExampleSection>
  );
};

// Example 3: Localization with forms
export const FormLocalizationExample = () => {
  const { text, lang } = useLocalization();
  const [loginResult, setLoginResult] = useState<string>('');

  const formFields = {
    email: {
      type: 'string' as const,
      label: text`your_email`,
      placeholder: text`enter_email`,
      required: true,
      initialValue: '',
      formProps: { type: 'email' }
    },
    password: {
      type: 'string' as const,
      label: text`your_password`,
      placeholder: text`enter_password`,
      required: true,
      initialValue: '',
      formProps: { type: 'password' }
    },
  };

  const handleSubmit = (data: any, callback?: () => void) => {
    console.log('Login attempt:', data);
    // Simulate login process
    setLoginResult(`${text`login`} attempted with: ${data.email}`);
    
    // Simulate API call
    setTimeout(() => {
      setLoginResult(`${text`login`} successful for: ${data.email}`);
      if (callback) callback();
      
      // Clear result after 3 seconds
      setTimeout(() => setLoginResult(''), 3000);
    }, 1000);
  };

  const validate = (data: any) => {
    const errors: any = {};
    if (data.email && !data.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }
    if (data.password && data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  // Custom submit button that uses form context
  const LoginButton = () => {
    const { submit, loading } = useForm();
    
    return (
      <Button 
        onClick={submit} 
        disabled={loading}
        variant="primary"
      >
        {loading ? 'Logging in...' : text`login`}
      </Button>
    );
  };

  return (
    <div>
      <h4>Localization with Forms</h4>
      <p>Forms automatically use localized strings for labels, placeholders, and validation messages.</p>
      
      {loginResult && (
        <Alert variant="success" className="mb-3">
          {loginResult}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">{text`login`} Form</h6>
        </Card.Header>
        <Card.Body>
          <FormProvider 
            formFields={formFields} 
            onSubmit={handleSubmit}
            validate={validate}
          >
            <FormInput name="email" />
            <FormInput name="password" />
            <FormActions className="justify-content-between">
              <LoginButton />
              <Button 
                type="button" 
                variant="outline-secondary"
                onClick={() => setLoginResult('')}
              >
                {text`cancel`}
              </Button>
            </FormActions>
          </FormProvider>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Code Example</h6>
        </Card.Header>
        <Card.Body>
          <CodeBlock language="typescript">
{`import { FormProvider, FormInput, useForm } from '@jasperoosthoek/react-toolbox';

const LoginForm = () => {
  const { text } = useLocalization();
  
  const formFields = {
    email: {
      type: 'string',
      label: text\`your_email\`,
      placeholder: text\`enter_email\`,
      required: true,
      initialValue: '',
      formProps: { type: 'email' }
    },
    password: {
      type: 'string', 
      label: text\`your_password\`,
      placeholder: text\`enter_password\`,
      required: true,
      initialValue: '',
      formProps: { type: 'password' }
    }
  };

  const handleSubmit = (data, callback) => {
    console.log('Login:', data);
    // Your login logic here
    setTimeout(callback, 1000);
  };

  const LoginButton = () => {
    const { submit, loading } = useForm();
    return (
      <Button onClick={submit} disabled={loading}>
        {loading ? 'Logging in...' : text\`login\`}
      </Button>
    );
  };

  return (
    <FormProvider formFields={formFields} onSubmit={handleSubmit}>
      <FormInput name="email" />
      <FormInput name="password" />
      <LoginButton />
    </FormProvider>
  );
};`}
          </CodeBlock>
        </Card.Body>
      </Card>
    </div>
  );
};

// Example 4: Localization with DataTable
export const DataTableLocalizationExample = () => {
  const { text } = useLocalization();

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ];

  const columns = [
    { name: 'Name', orderBy: 'name', selector: 'name' },
    { name: 'Email', orderBy: 'email', selector: 'email' },
    { name: 'Role', orderBy: 'role', selector: 'role' },
    { name: 'Actions', selector: (user: any) => (
      <span>
        <EditButton size="sm" title={text`modal_edit`} />
        <DeleteConfirmButton 
          size="sm" 
          onDelete={() => console.log('Delete', user.id)}
        />
      </span>
    ) },
  ];

  return (
    <div>
      <h4>DataTable with Localization</h4>
      <p>DataTable components automatically use localized strings for search, pagination, and empty states.</p>
      
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Users Table</h6>
        </Card.Header>
        <Card.Body>
          <DataTable
            data={users}
            columns={columns}
            // searchPlaceholder={text`search`}
            rowsPerPageOptions={[5, 10, 25, null]}
            rowsPerPage={5}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

// Example 5: Language switching component
export const LanguageSwitcherExample = () => {
  const { lang, languages, setLanguage } = useLocalization();

  return (
    <div>
      <h4>Language Switcher Component</h4>
      <p>Build reusable language switcher components.</p>
      
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Language Switcher</h6>
        </Card.Header>
        <Card.Body>
          <Form.Select 
            value={lang} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: '200px' }}
          >
            {languages.map(language => (
              <option key={language} value={language}>
                {defaultLanguages[language] || language}
              </option>
            ))}
          </Form.Select>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Code Example</h6>
        </Card.Header>
        <Card.Body>
          <pre><CodeBlock language="typescript">
            {`import { useLocalization } from '@jasperoosthoek/react-toolbox';

const LanguageSwitcher = () => {
  const { lang, languages, setLanguage } = useLocalization();

  return (
    <Form.Select 
      value={lang} 
      onChange={(e) => setLanguage(e.target.value)}
    >
      {languages.map(language => (
        <option key={language} value={language}>
          {defaultLanguages[language]}
        </option>
      ))}
    </Form.Select>
  );
};`}
          </CodeBlock></pre>
        </Card.Body>
      </Card>
    </div>
  );
};

// Example 6: Complete localization reference
export const LocalizationReferenceExample = () => {
  const { text, lang } = useLocalization();

  return (
    <div>
      <h4>Complete Localization Reference</h4>
      <p>All available default localization strings in the current language: <Badge bg="info">{lang.toUpperCase()}</Badge></p>
      
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Default Localization Strings</h6>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>select</code></td>
                <td>{text`select`}</td>
                <td>text`select`</td>
              </tr>
              <tr>
                <td><code>search</code></td>
                <td>{text`search`}</td>
                <td>text`search`</td>
              </tr>
              <tr>
                <td><code>save</code></td>
                <td>{text`save`}</td>
                <td>text`save`</td>
              </tr>
              <tr>
                <td><code>cancel</code></td>
                <td>{text`cancel`}</td>
                <td>text`cancel`</td>
              </tr>
              <tr>
                <td><code>delete</code></td>
                <td>{text`delete`}</td>
                <td>text`delete`</td>
              </tr>
              <tr>
                <td><code>are_you_sure</code></td>
                <td>{text`are_you_sure`}</td>
                <td>text`are_you_sure`</td>
              </tr>
              <tr>
                <td><code>close</code></td>
                <td>{text`close`}</td>
                <td>text`close`</td>
              </tr>
              <tr>
                <td><code>ok</code></td>
                <td>{text`ok`}</td>
                <td>text`ok`</td>
              </tr>
              <tr>
                <td><code>login</code></td>
                <td>{text`login`}</td>
                <td>text`login`</td>
              </tr>
              <tr>
                <td><code>logout</code></td>
                <td>{text`logout`}</td>
                <td>text`logout`</td>
              </tr>
              <tr>
                <td><code>your_email</code></td>
                <td>{text`your_email`}</td>
                <td>text`your_email`</td>
              </tr>
              <tr>
                <td><code>enter_email</code></td>
                <td>{text`enter_email`}</td>
                <td>text`enter_email`</td>
              </tr>
              <tr>
                <td><code>your_password</code></td>
                <td>{text`your_password`}</td>
                <td>text`your_password`</td>
              </tr>
              <tr>
                <td><code>enter_password</code></td>
                <td>{text`enter_password`}</td>
                <td>text`enter_password`</td>
              </tr>
              <tr>
                <td><code>required_field</code></td>
                <td>{text`required_field`}</td>
                <td>text`required_field`</td>
              </tr>
              <tr>
                <td><code>choose_one</code></td>
                <td>{text`choose_one`}</td>
                <td>text`choose_one`</td>
              </tr>
              <tr>
                <td><code>everything</code></td>
                <td>{text`everything`}</td>
                <td>text`everything`</td>
              </tr>
              <tr>
                <td><code>number_of_rows</code></td>
                <td>{text`number_of_rows`}</td>
                <td>text`number_of_rows`</td>
              </tr>
              <tr>
                <td><code>modal_create</code></td>
                <td>{text`modal_create`}</td>
                <td>text`modal_create`</td>
              </tr>
              <tr>
                <td><code>modal_edit</code></td>
                <td>{text`modal_edit`}</td>
                <td>text`modal_edit`</td>
              </tr>
              <tr>
                <td><code>no_information_to_display</code></td>
                <td>{text`no_information_to_display`}</td>
                <td>text`no_information_to_display`</td>
              </tr>
              <tr>
                <td><code>information_is_being_loaded</code></td>
                <td>{text`information_is_being_loaded`}</td>
                <td>text`information_is_being_loaded`</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};


// Custom localization strings
export const customStrings: AdditionalLocalization = {
  en: {
    welcome_message: "Welcome to our application!",
    user_count: (count: number) => `There ${count === 1 ? 'is' : 'are'} ${count} user${count === 1 ? '' : 's'} online`,
    greeting: (name: string) => `Hello, ${name}!`,
    notification: (type: string, message: string) => `${type}: ${message}`,
    product_price: (name: string, price: number) => `${name} costs $${price.toFixed(2)}`,
  },
  fr: {
    welcome_message: "Bienvenue dans notre application!",
    user_count: (count: number) => `Il y a ${count} utilisateur${count === 1 ? '' : 's'} en ligne`,
    greeting: (name: string) => `Bonjour, ${name}!`,
    notification: (type: string, message: string) => `${type}: ${message}`,
    product_price: (name: string, price: number) => `${name} coûte ${price.toFixed(2)}$`,
  },
  nl: {
    welcome_message: "Welkom bij onze applicatie!",
    user_count: (count: number) => `Er ${count === 1 ? 'is' : 'zijn'} ${count} gebruiker${count === 1 ? '' : 's'} online`,
    greeting: (name: string) => `Hallo, ${name}!`,
    notification: (type: string, message: string) => `${type}: ${message}`,
    product_price: (name: string, price: number) => `${name} kost €${price.toFixed(2)}`,
  },
};