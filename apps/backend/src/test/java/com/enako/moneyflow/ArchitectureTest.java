package com.enako.moneyflow;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

@AnalyzeClasses(packages = "com.enako.moneyflow", importOptions = {ImportOption.DoNotIncludeTests.class})
public class ArchitectureTest {

    @ArchTest
    static final ArchRule layers_must_respect_architectural_hierarchy = layeredArchitecture()
        .consideringAllDependencies()
        .layer("Domain").definedBy("..modules..domain..")
        .layer("Application").definedBy("..modules..application..")
        .layer("Api").definedBy("..modules..api..")
        .layer("Infrastructure").definedBy("..modules..infrastructure..")
        
        .whereLayer("Domain").mayOnlyBeAccessedByLayers("Application", "Api", "Infrastructure")
        .whereLayer("Application").mayOnlyBeAccessedByLayers("Api", "Infrastructure")
        .whereLayer("Api").mayNotBeAccessedByAnyLayer();

    @ArchTest
    static final ArchRule domain_package_has_zero_spring_jpa_jakarta_imports = noClasses()
        .that().resideInAPackage("..modules..domain..")
        .should().dependOnClassesThat().resideInAnyPackage(
            "org.springframework..",
            "jakarta.persistence..",
            "jakarta.transaction.."
        );
}
